import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dataBase from "./database.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 10000;
const secretKey = "celestique";
const salt = parseInt(process.env.SALT);

app.use(
  cors({
    origin: ["https://develhope.github.io/FS34-Team1-Project2/"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/ping", (req, res) => {
  res.json({ message: "Backend attivo e funzionante!" });
});

app.get("/users", async (req, res) => {
  try {
    const db = await dataBase.many("SELECT * FROM users");
    res.status(200).json(db);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.post("/users/register", async (req, res) => {
  const { nome, cognome, email, eta, password, cellulare } = req.body;
  try {
    const passwordCryptata = await bcrypt.hash(password, salt);
    await dataBase.none(
      "INSERT INTO users (nome, cognome, email, eta, password, cellulare) VALUES ($1, $2, $3, $4, $5, $6)",
      [nome, cognome, email, eta, passwordCryptata, cellulare]
    );
    return res.status(201).json({ message: "utente registrato con successo" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await dataBase.oneOrNone(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (user) {
      const hashedPassword = user.password;
      const isTrue = await bcrypt.compare(password, hashedPassword);
      if (isTrue) {
        const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
          expiresIn: "1h",
        });

        return res.status(200).json({
          message: "login effettuato con successo",
          token,
          user: {
            id: user.id,
            nome: user.nome,
            cognome: user.cognome,
            email: user.email,
            eta: user.eta,
            cellulare: user.cellulare,
          },
        });
      }
    } else {
      return res.status(400).json({ message: "Credenziali non valide" });
    }
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

app.get("/profilo", async (req, res) => {
  const auth = req.headers.authorization;

  try {
    if (!auth) {
      return res.status(401).json({ message: "Token mancante" });
    }

    const token = auth.split(" ")[1];

    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token non valido" });
      }

      const userExist = await dataBase.one(
        "SELECT * FROM users WHERE email = $1",
        [decoded.email]
      );

      res.status(200).json({ user: userExist });
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const users = await dataBase.one("SELECT * FROM users WHERE id = $1", [id]);
    res.status(200).json(users);
  } catch (error) {
    res.status(404).send("id non trovato");
  }
});

app.put("/users/update/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, cognome, eta, password, cellulare } = req.body;

  try {
    const currentUser = await dataBase.oneOrNone(
      "SELECT nome, cognome, eta, password, cellulare FROM users WHERE id = $1",
      [id]
    );

    if (!currentUser) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    const updatedNome = nome ?? currentUser.nome;
    const updatedCognome = cognome ?? currentUser.cognome;
    const updatedEta = eta ?? currentUser.eta;
    const updatedPassword = password ?? currentUser.password;
    const updatedCellulare = cellulare ?? currentUser.cellulare;

    const result = await dataBase.result(
      "UPDATE users SET nome=$1, cognome=$2, eta=$3, password=$4, cellulare=$5 WHERE id = $6",
      [
        updatedNome,
        updatedCognome,
        updatedEta,
        updatedPassword,
        updatedCellulare,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "Nessuna modifica effettuata" });
    }

    const updatedUser = await dataBase.one(
      "SELECT id, nome, cognome, eta, cellulare, email FROM users WHERE id = $1",
      [id]
    );

    return res
      .status(200)
      .json({ message: "Modifica effettuata con successo", user: updatedUser });
  } catch (error) {
    return res.status(400).json({ errore: error.message });
  }
});

app.delete("/users/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await dataBase.none("DELETE FROM users WHERE id = $1", [id]);
    return res.status(200).json({ message: "Utente eliminato con successo" });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

app.post("/orders", async (req, res) => {
  const { userId, products } = req.body;

  console.log("BODY ricevuto:", req.body);

  if (!userId || !products) {
    return res.status(400).json({ error: "Dati non validi" });
  }

  try {
    await dataBase.none(
      `INSERT INTO orders (user_id, products) VALUES ($1, $2)`,
      [userId, JSON.stringify(products)] // per il JSONB
    );
    res.status(201).json({ message: "Ordine creato con successo" });
  } catch (error) {
    console.error("Errore durante l'inserimento ordine:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

app.get("/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await dataBase.any(
      "SELECT * FROM orders WHERE user_id = $1",
      [id]
    );

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "Nessun ordine trovato per questo utente" });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await dataBase.oneOrNone(
      "SELECT * FROM products WHERE id = $1",
      [productId]
    );
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Prodotto non trovato" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore del server" });
  }
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server in ascolto sulla porta ${process.env.PORT || PORT}`);
});

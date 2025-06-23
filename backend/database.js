import pgPromise from "pg-promise";
import dotenv from "dotenv";
dotenv.config();
const dataBase = pgPromise();
const db = pgPromise({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false, // NECESSARIO per Render
  },
});

db.none(
  ` CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY, 
nome VARCHAR NOT NULL, 
cognome VARCHAR NOT NULL, 
email VARCHAR NOT NULL UNIQUE,
eta INT NOT NULL , 
password VARCHAR NOT NULL,
cellulare VARCHAR NOT NULL
)`
)
  .then(() => console.log("Tabella users creata correttamente"))

  .catch((error) =>
    console.error("Errore durante la creazione della tabella users", error)
  );

db.none(
  `CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(500),
    price NUMERIC(10, 2) NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    model VARCHAR(100),
    color VARCHAR(50),
    category VARCHAR(100),
    discount NUMERIC(5, 2) DEFAULT 0.00,
    popular BOOLEAN DEFAULT FALSE,
    onSale BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`
)
  .then(() => console.log("Tabella products creata correttamente"))

  .catch((error) =>
    console.error("Errore durante la creazione della tabella products", error)
  );

db.none(
  `CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  products JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`
)
  .then(() => console.log("Tabella orders creata correttamente"))

  .catch((error) =>
    console.error("Errore durante la creazione della tabella orders", error)
  );

export default db;

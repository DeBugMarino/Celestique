import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function CheckOut() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user.id;
  const [pagamento, setPagamento] = useState({
    numeroCarta: "",
    nomeTitolare: "",
    indirizzoFatturazione: "",
    cvc: "",
    dataScadenza: "",
  });

  const [iMieiAcquisti, setImieiAcquisti] = useState([]);
  useEffect(() => {
    localStorage.setItem("iMieiAcquisti", JSON.stringify(iMieiAcquisti));
  }, [iMieiAcquisti]);

  const [messaggio, setMessaggio] = useState(null);
  const [errori, setErrori] = useState([]);

  useEffect(() => {
    localStorage.setItem("pagamento", JSON.stringify(pagamento));
  }, [pagamento]);

  function handleChange(event) {
    const { name, value } = event.target;
    setPagamento((prevPagamento) => ({
      ...prevPagamento,
      [name]: value,
    }));
  }
  const [prodotti, setProdotti] = useState(() => {
    const prodottiLocal = localStorage.getItem("prodotti");
    return prodottiLocal ? JSON.parse(prodottiLocal) : [];
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const { numeroCarta, nomeTitolare, dataScadenza, cvc } = pagamento;

    const errors = [];

    if (!/^\d{16}$/.test(numeroCarta)) {
      errors.push("Il numero della carta deve contenere 16 cifre.");
    }

    if (!/^[a-zA-Z\s]{5,}$/.test(nomeTitolare)) {
      errors.push("Il nome del titolare non è valido.");
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(dataScadenza)) {
      errors.push("La data di scadenza non è valida (MM/YY).");
    } else {
      const [mm, yy] = dataScadenza.split("/").map(Number);
      const today = new Date();
      const expiry = new Date(`20${yy}`, mm);
      if (expiry < today) {
        errors.push("La carta è scaduta.");
      }
    }

    if (!/^\d{3}$/.test(cvc)) {
      errors.push("Il CVC deve contenere 3 cifre.");
    }

    if (errors.length > 0) {
      setMessaggio(null);
      setErrori(errors);
      return;
    }
    try {
      const response = await fetch("https://celestique.onrender.com/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ userId, prodotti }),
        body: JSON.stringify({ userId, products: prodotti.map((p) => p.id) }),
      });
      console.log("Dati inviati:", {
        userId,
        products: prodotti.map((p) => p.id),
      });
      setErrori([]);
      setMessaggio("Ordine effettuato con successo!");
      setImieiAcquisti((prev) => [...prev, { userId, ...prodotti }]);
      setPagamento({
        numeroCarta: "",
        nomeTitolare: "",
        indirizzoFatturazione: "",
        cvc: "",
        datascadenza: "",
      });

      localStorage.removeItem("prodotti");

      navigate("/ordinesuccesso");
    } catch (error) {
      console.error("Errore durante l'invio dei dati:", error);
      setMessaggio("Si è verificato un errore durante l'invio dei dati.");
    }
  }

  return (
    <>
      <div className="flex flex-col items-center border-b bg-white py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32">
        <div className="mt-4 py-2 text-xs sm:mt-0 sm:ml-auto sm:text-base">
          <div className="relative"></div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid sm:px-10 lg:grid-cols-1 lg:px-20 xl:px-32">
          <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
            <p className="text-xl text-black font-medium">Dettagli pagamento</p>
            <p className="text-gray-900">
              Completa l'ordine fornendo i dati di pagamento.
            </p>

            <label
              htmlFor="card-holder"
              className="mt-4 mb-2 block text-black text-sm font-medium"
            >
              Titolare della carta
            </label>
            <input
              onChange={handleChange}
              value={pagamento.nomeTitolare}
              name="nomeTitolare"
              type="text"
              id="card-holder"
              className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none"
              placeholder="Your full name here"
            />

            <label
              htmlFor="card-no"
              className="mt-4 mb-2 block text-sm text-black font-medium"
            >
              Dettagli carta
            </label>
            <div className="flex">
              <input
                onChange={handleChange}
                name="numeroCarta"
                value={pagamento.numeroCarta}
                type="text"
                id="card-no"
                className="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none"
                placeholder="xxxx-xxxx-xxxx-xxxx"
                required
                pattern="\d{16}"
              />
              <input
                onChange={handleChange}
                type="text"
                name="dataScadenza"
                className="ml-2 w-1/4 rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none"
                placeholder="MM/YY"
                required
                pattern="(0[1-9]|1[0-2])\/\d{2}"
              />
              <input
                onChange={handleChange}
                type="text"
                name="cvc"
                className="ml-2 w-1/4 rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none"
                placeholder="CVC"
                required
                pattern="\d{3}"
              />
            </div>

            <label
              htmlFor="billing-address"
              className="mt-4 mb-2 block text-sm text-black font-medium"
            >
              Indirizzo di fatturazione
            </label>
            <div className="flex flex-col sm:flex-row">
              <input
                type="text"
                id="billing-address"
                name="indirizzoFatturazione"
                onChange={handleChange}
                value={pagamento.indirizzoFatturazione}
                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none"
                placeholder="Street Address"
              />
            </div>

            <button
              type="submit"
              className="mt-4 mb-8 w-full rounded-md bg-sky-300 px-6 py-3 font-medium text-white hover:bg-blue-500"
            >
              Acquista
            </button>
          </div>
        </div>
      </form>
      {messaggio && (
        <div
          id="popUp"
          className="rounded-md border border-gray-300 bg-white p-4"
        >
          <p className="font-medium text-sky-500">{messaggio}</p>
          <button
            onClick={(e) => setMessaggio(null)}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100"
          >
            Chiudi
          </button>
        </div>
      )}
      {errori.length > 0 && (
        <div className="my-4 rounded-md border border-red-300 bg-red-50 p-4">
          <p className="font-medium text-red-700">
            Correggi i seguenti errori:
          </p>
          <ul className="list-disc list-inside text-red-600 text-sm">
            {errori.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import Aside from "./Aside";
import Navbar from "./Navbar";
import { useAuth } from "../context/authContext";
import non_ci_sono_acquisti from "../assets/non_ci_sono_acquisti.png";

export default function MyOrders() {
  const [ordini, setOrdini] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchOrdini() {
      if (!user?.id) return;

      try {
        const response = await fetch(
          `https://celestique.onrender.com/${user.id}`
        );
        const data = await response.json();

        const ordiniConProdotti = await Promise.all(
          data.orders.map(async (ordine) => {
            const prodottiDettagliati = await Promise.all(
              ordine.products.map(async (productId) => {
                const res = await fetch(
                  `https://celestique.onrender.com/${productId}`
                );
                return await res.json();
              })
            );
            return {
              id: ordine.id,
              prodotti: prodottiDettagliati,
            };
          })
        );

        setOrdini(ordiniConProdotti);
        setLoading(false);
        // console.log("Ordini recuperati:", ordiniConProdotti);
      } catch (err) {
        setError("Errore durante il recupero degli acquisti");
        setLoading(false);
      }
    }

    fetchOrdini();
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="flex-1 ml-0 lg:p-8">
        <Aside />
        <main className="flex-1 ml-0 lg:ml-64 p-8">
          {loading ? (
            <p>Caricamento in corso...</p>
          ) : ordini.length === 0 ? (
            <img
              src={non_ci_sono_acquisti}
              alt="Non ci sono acquisti"
              className="w-1/2 mx-auto"
            />
          ) : (
            <>
              <h3 className="font-bold text-lg mb-10">I miei Acquisti</h3>
              <ul className="space-y-6">
                {ordini.map((ordine) => (
                  <li key={ordine.id} className="space-y-3 max-w-2xl">
                    <h4 className="font-semibold text-lg">
                      Ordine {ordine.id}
                    </h4>
                    <ul className="space-y-3">
                      {ordine.prodotti.map((prodotto) => (
                        <li
                          key={prodotto.id}
                          className="flex items-center space-x-4 p-4 border rounded-lg shadow-sm bg-white"
                        >
                          <img
                            className="h-12 w-12 rounded-full object-cover"
                            src={prodotto.image}
                            alt={prodotto.title}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {prodotto.title}
                            </p>
                            <a
                              href={`http://localhost:5173/prodotti/${prodotto.id}`}
                              className="text-sm text-sky-600 hover:underline"
                            >
                              Vai al prodotto
                            </a>
                          </div>
                          <div className="text-base font-semibold text-gray-900">
                            {prodotto.price} $
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </main>
      </div>
    </>
  );
}

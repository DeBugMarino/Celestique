import Navbar from "./Navbar";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Loading from "./Loading";
export default function Prodotti() {
  const [idPro, setIdPro] = useState(null);
  const navigate = useNavigate();
  const [messaggio, setMessaggio] = useState(null);
  const [prodotti, setProdotti] = useState(() => {
    const prodottiLocal = localStorage.getItem("prodotti");
    return prodottiLocal ? JSON.parse(prodottiLocal) : [];
  });

  useEffect(() => {
    localStorage.setItem("prodotti", JSON.stringify(prodotti));
  }, [prodotti]);
  const { error, data } = useSWR("https://celestique.onrender.com/products/");
  if (!data && !error) return <Loading></Loading>;
  if (error) return <p>Errore nel caricamento dei dati</p>;
  function handleAggiungiProdotto(prodotto) {
    setProdotti((prev) => [...prev, prodotto]);
    setMessaggio(`Aggiunto al carrello: ${prodotto.title}`);
    setTimeout(() => {
      setMessaggio(null);
    }, 2000);
  }
  function vediProdotto(id) {
    const prodottoId = id;
    console.log(prodottoId);
    setIdPro(prodottoId);
    navigate(`/prodotti/${prodottoId}`);
  }
  return (
    <>
      <Navbar />
      <div className="p-4 mx-auto lg:max-w-6xl md:max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">
          Il Nostro Catalogo Completo
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {data.products.map((prodotto) => (
            <div
              key={prodotto.id}
              className="bg-white flex flex-col rounded overflow-hidden shadow-md hover:scale-[1.01] transition-all relative"
            >
              <button
                onClick={() => vediProdotto(prodotto.id)}
                className="block"
              >
                <div className="w-full">
                  <img
                    src={prodotto.image}
                    alt={prodotto.title}
                    className="w-full aspect-[18/24] object-cover object-top"
                  />
                </div>
                <div className="p-4">
                  <h5 className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-2">
                    {prodotto.title}
                  </h5>
                  <div className="mt-2 flex items-center flex-wrap gap-2">
                    <h6 className="text-sm sm:text-base font-semibold text-slate-900">
                      {prodotto.price} $
                    </h6>
                  </div>
                </div>
              </button>
              <div className="min-h-[50px] p-4 !pt-0">
                <button
                  type="button"
                  className="absolute left-0 right-0 bottom-3 max-w-[88%] mx-auto text-sm px-2 py-2 font-medium w-full bg-blue-600 hover:bg-blue-700 text-white tracking-wide outline-none border-none rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAggiungiProdotto(prodotto);
                  }}
                >
                  Aggiungi al carrello
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
      <Footer />
    </>
  );
}

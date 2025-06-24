import { useAuth } from "../context/authContext";
import Navbar from "./Navbar";
import Aside from "./Aside";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { logout, token, user, setUser } = useAuth();
  const [apriMod, setApriMod] = useState(false);
  const [mod, setMod] = useState({});
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [delet, setDelet] = useState(false);
  const Navigazione = useNavigate();

  function handleChange(event) {
    setMod((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (mod.password) {
      const passwordRegole = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordRegole.test(mod.password)) {
        setError(
          "La password deve contenere almeno 8 caratteri, una lettera maiuscola, un numero e un carattere speciale."
        );
        return;
      }
    }

    try {
      const response = await fetch(
        `https://celestique.onrender.com/users/update/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(mod),
        }
      );
      const result = await response.json();

      setMessage("modifica effettuata con successo");
      setUser(result.user);
      setApriMod(false);
    } catch (error) {
      console.error("error");
      setError("Modifica non riuscita");
    }
  }
  async function handleDelet(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `https://celestique.onrender.com/users/delete/${user.id}`,
        {
          method: "DELETE",
          headers: { "Content-type": "application/json" },
        }
      );
      const result = await response.json();

      setMessage("Account eliminato con successo");
      localStorage.removeItem("token");
      setUser(null);
      logout();
      setTimeout(() => {
        Navigazione("/accounteliminato");
      }, 500);

      localStorage.removeItem("token");
    } catch (error) {
      console.error("error");
      setError("Eliminazione non riuscita");
    }
  }
  return (
    <>
      <Navbar />
      <div className="flex">
        <Aside></Aside>
        <main className="flex-1 ml-0 lg:ml-64 p-8">
          <div className="flow-root w-full max-w-200 bg-white p-8 rounded-2xl shadow-xl space-y-5 my-8 ">
            <div className="px-4 py-5 sm:px-6">
              <h3 className=" leading-6 font-medium text-black text-4xl">
                Il tuo profilo
              </h3>
            </div>
            <dl className="-my-3 divide-y divide-gray-200 rounded border border-gray-200 text-sm *:even:bg-gray-50">
              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900 text-xl">Nome</dt>

                <dd className="text-gray-700 sm:col-span-2 text-xl">
                  {user.nome}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4 ">
                <dt className="font-medium text-gray-900 text-xl">Cognome</dt>

                <dd className="text-gray-700 sm:col-span-2 text-xl">
                  {user.cognome}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900 text-xl">Email</dt>

                <dd className="text-gray-700 sm:col-span-2 text-xl">
                  {user.email}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900 text-xl">Cellulare</dt>

                <dd className="text-gray-700 sm:col-span-2 text-xl">
                  {user.cellulare}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900 text-xl">Età</dt>

                <dd className="text-gray-700 sm:col-span-2 text-xl ">
                  {user.eta}
                </dd>
              </div>
            </dl>
            <p className="mt-1 max-w-2xl text-sm text-gray-500"></p>
            <button onClick={() => setApriMod(!apriMod)}>
              <p className="p-5 flex items-center gap-2 ">
                {" "}
                <FaUserEdit /> Modifica account
              </p>
            </button>
            <button onClick={() => setDelet(true)}>
              <p className="p-5 flex items-center gap-2">
                <MdDelete />
                Elimina account
              </p>
            </button>
            {apriMod && (
              <div
                className="fixed inset-0 z-[999]  flex items-center justify-center bg-trasparent bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 overflow-y-auto  scrollbar-hidden"
                onClick={() => setApriMod(false)} // clic fuori chiude il modale
              >
                <div
                  className="relative w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-lg scrollbar-hiddent mt-24"
                  onClick={(e) => e.stopPropagation()} // evita chiusura cliccando dentro
                >
                  <div className="relative flex flex-col">
                    <div className="relative m-2.5 items-center flex justify-center text-white h-24 rounded-md bg-blue-300">
                      <h3 className="text-2xl">Modifica Profilo</h3>
                    </div>
                    <div className="flex flex-col gap-4 p-6">
                      <div className="w-full">
                        <label className="block mb-2 text-sm text-slate-600">
                          Email
                        </label>
                        <input
                          type="email"
                          disabled
                          defaultValue={user.email}
                          className="w-full bg-gray-100 placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2"
                        />
                      </div>

                      <div className="w-full">
                        <label className="block mb-2 text-sm text-slate-600">
                          Nome
                        </label>
                        <input
                          name="nome"
                          type="text"
                          placeholder={user.nome}
                          onChange={handleChange}
                          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2"
                        />
                      </div>

                      <div className="w-full">
                        <label className="block mb-2 text-sm text-slate-600">
                          Cognome
                        </label>
                        <input
                          name="cognome"
                          type="text"
                          placeholder={user.cognome}
                          onChange={handleChange}
                          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2"
                        />
                      </div>

                      <div className="w-full">
                        <label className="block mb-2 text-sm text-slate-600">
                          Cellulare
                        </label>
                        <input
                          name="cellulare"
                          type="tel"
                          placeholder={user.cellulare}
                          onChange={handleChange}
                          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2"
                        />
                      </div>

                      <div className="w-full">
                        <label className="block mb-2 text-sm text-slate-600">
                          Età
                        </label>
                        <input
                          name="eta"
                          type="number"
                          placeholder={user.eta}
                          onChange={handleChange}
                          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2"
                        />
                      </div>

                      <div className="w-full">
                        <label className="block mb-2 text-sm text-slate-600">
                          Password
                        </label>
                        <input
                          name="password"
                          type="password"
                          placeholder="Nuova password"
                          onChange={handleChange}
                          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2"
                        />
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full rounded-md bg-blue-300 py-2 px-4 text-center text-sm text-white transition-all shadow-md hover:shadow-lg"
                      >
                        Salva Modifiche
                      </button>
                    </div>
                  </div>
                </div>
                {error && (
                  <div
                    id="popUp"
                    className=" shadow-xl flex items-center justify-center z-50 bg-black bg-opacity-50"
                  >
                    <button
                      onClick={(e) => setError(null)}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <p className=" py-5 px-10 font-medium text-black text-lg">
                      {error}
                    </p>
                    <div className="sezBtnAlert"></div>
                  </div>
                )}
              </div>
            )}

            {message && (
              <div id="popUp" className="border-1 black">
                <div>
                  <div className="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
                    {message}
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
                    <button
                      onClick={() => {
                        setMessage(false);
                      }}
                      className=" rounded-md border border-gray py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                      type="button"
                    >
                      Chiudi
                    </button>
                  </div>
                </div>
              </div>
            )}
            {delet && (
              <div id="popUp" className="border-1 black">
                <div>
                  <div className="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
                    Sei sicuro di voler eliminare l'account?
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
                    <button
                      onClick={() => {
                        setDelet(false);
                      }}
                      className=" rounded-md border border-gray py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                      type="button"
                    >
                      Annulla
                    </button>
                    <button
                      onClick={(event) => handleDelet(event)}
                      className=" rounded-md bg-red-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                      type="button"
                    >
                      Elimina Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <div
        id="FOOTER"
        className="flex overflow-hidden bg-white pt-1 bottom-0 w-full mt-30"
      >
        <div
          id="main-content"
          className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64"
        >
          <footer className="bg-white md:flex md:items-center md:justify-between shadow rounded-lg p-4 md:p-6 xl:p-8 my-6 mx-4 buttom-0">
            <ul className="flex items-center flex-wrap mb-6 md:mb-0">
              <li>
                <a
                  href="#"
                  className="text-sm font-normal text-gray-500 hover:underline mr-4 md:mr-6"
                >
                  Terms and conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm font-normal text-gray-500 hover:underline mr-4 md:mr-6"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm font-normal text-gray-500 hover:underline mr-4 md:mr-6"
                >
                  Licensing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm font-normal text-gray-500 hover:underline mr-4 md:mr-6"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm font-normal text-gray-500 hover:underline"
                >
                  Contact
                </a>
              </li>
            </ul>
            <div className="flex sm:justify-center space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-900">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </footer>
          <p className="text-center text-sm text-gray-500 my-10">
            &copy; 2025{" "}
            <a href="#" className="hover:underline" target="_blank">
              Celestique
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
      <script async defer src="https://buttons.github.io/buttons.js"></script>
      <script src="https://demo.themesberg.com/windster/app.bundle.js"></script>
    </>
  );
}

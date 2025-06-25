import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/authContext";
import Navbar from "./Navbar";

export default function Login() {
  const [messaggio, setMessaggio] = useState(null);
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login, error } = useAuth();
  function handleChange(event) {
    setUser({ ...user, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const result = await login(user);
      if (result?.esito) {
        setMessaggio("Login avvenuto con successo!");
        setTimeout(() => {
          navigate("/profilo");
        }, 2000);
      } else {
        setMessaggio(result.messaggio);
      }
    } catch (error) {
      console.error("Errore imprevisto:", error);
      setMessaggio("Errore imprevisto durante il login.");
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-350px bg-white flex justify-center p-4 pt-10 ">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="@email"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="inserisci la tua password"
                onChange={handleChange}
              />
            </div>

            <button className="w-full bg-sky-500 text-white font-medium py-2.5 rounded-lg transition-colors">
              Accedi
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Non hai un account?
            <Link
              to="/registrazione"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Registrati
            </Link>
          </div>
        </div>
        {messaggio && (
          <div
            id="popUp"
            className=" shadow-xl flex items-center justify-center z-50 bg-black bg-opacity-50 min-w-[300px]"
          >
            <button
              onClick={(e) => setMessaggio(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 "
            >
              ✖
            </button>
            <p className="text-2xl text-center text-blue-300 font-bold">
              {messaggio}
            </p>
            <div className="sezBtnAlert"></div>
          </div>
        )}
      </div>
    </>
  );
}

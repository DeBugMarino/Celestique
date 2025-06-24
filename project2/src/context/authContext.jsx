import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem("user");
    return localUser ? JSON.parse(localUser) : null;
  });

  async function login({ email, password }) {
    try {
      const response = await fetch(
        "https://develhope.github.io/FS34-Team1-Project2/login",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setUser(result.user);
        setError(null);
        localStorage.setItem("token", result.token);
        // localStorage.setItem("user", JSON.stringify(result.user));
        return { esito: true, messaggio: "Credenziali ok" };
      } else {
        console.log("user not found");
        setUser(null);
        return { esito: false, messaggio: "Credenziali errate" };
      }
    } catch (error) {
      console.error("Errore durante la richiesta:", error);
    }
  }

  function getToken() {
    return localStorage.getItem("token");
  }

  function validate(password) {
    const pattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return pattern.test(password);
  }

  async function registrazione(userData) {
    if (!validate(userData.password)) {
      setError(
        "La password deve contenere almeno 8 caretteri, una lettera maiuscola, un carattere speciale ed alemno un numero."
      );
      return {
        esito: false,
        messaggio:
          "La password deve contenere almeno 8 caratteri, una lettera maiuscola, un carattere speciale ed almeno un numero.",
      };
    }
    try {
      const response = await fetch(
        "https://develhope.github.io/FS34-Team1-Project2/login",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(userData),
        }
      );
      const result = await response.json();
      if (response.ok) {
        // setUsers((prev) => [...prev, userData]);
        setError(null);
        return { esito: true, messaggio: null };
      } else {
        setError("email già registrata");
        return { esito: false, messaggio: "Email già registrata" };
      }
    } catch {
      setError("Errore durante la registrazione");
      return { esito: false, messaggio: "Errore durante il login" };
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        // users,
        login,
        registrazione,
        logout,
        error,
        validate,
        setUser,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

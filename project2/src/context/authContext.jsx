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
        "https://celestique.onrender.com/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const text = await response.text();
      let result;

      try {
        result = JSON.parse(text);
      } catch (err) {
        console.error("Risposta non in JSON:", text);
        return { esito: false, messaggio: "Risposta non valida dal server" };
      }

      if (response.ok) {
        setUser(result.user);
        setError(null);
        localStorage.setItem("token", result.token);
        return { esito: true, messaggio: "Login ok" };
      } else {
        return {
          esito: false,
          messaggio: result.message || "Credenziali errate",
        };
      }
    } catch (error) {
      console.error("Errore di rete:", error);
      return { esito: false, messaggio: "Errore di rete" };
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
        "https://celestique.onrender.com/users/register",
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

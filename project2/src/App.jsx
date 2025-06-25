import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Registrazione from "./components/Registrazione";
import Carrello from "./components/Carrello";
import Audio from "./components/Audio";
import Gaming from "./components/Gaming";
import Mobile from "./components/Mobile";
import Tv from "./components/Tv";
import Login from "./components/Login";
import AuthProvider from "./context/authContext";
import Privacy from "./context/privateContext";
import Profilo from "./components/Profilo";
import CheckOut from "./components/CheckOut";
import Prodotti from "./components/Prodotti";
import Prodotto from "./components/Prodotto";
import ElettroDomestici from "./components/ElettroDomestici";
import Laptop from "./components/Laptop";
import MyOrders from "./components/MyOrders";
import OrdineSuccesso from "./components/OrdineSuccesso";
import AccountEliminato from "./components/AccountEliminato";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/Celestique">
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route
            path="/profilo"
            element={
              <Privacy>
                <Profilo />
              </Privacy>
            }
          ></Route>
          <Route
            path="/myorders"
            element={
              <Privacy>
                <MyOrders />
              </Privacy>
            }
          ></Route>
          <Route
            path="/dashboard"
            element={
              <Privacy>
                <Dashboard />
              </Privacy>
            }
          ></Route>
          <Route path="/registrazione" element={<Registrazione />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/carrello" element={<Carrello />}>
            <Route path="checkout" element={<CheckOut />}></Route>
          </Route>
          <Route path="/audio" element={<Audio />}></Route>
          <Route
            path="/elettrodomestici"
            element={<ElettroDomestici />}
          ></Route>
          <Route path="/laptop" element={<Laptop />}></Route>
          <Route path="/gaming" element={<Gaming />}></Route>
          <Route path="/mobile" element={<Mobile />}></Route>
          <Route path="/tv" element={<Tv />}></Route>
          <Route path="/ordinesuccesso" element={<OrdineSuccesso />}></Route>
          <Route
            path="/accounteliminato"
            element={<AccountEliminato />}
          ></Route>
          <Route path="/prodotti" element={<Prodotti />}></Route>
          <Route path="/prodotti/:id" element={<Prodotto />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

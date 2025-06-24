import { useState } from "react";
import { useAuth } from "../context/authContext";
import Banner from "./banner";
import Categories from "./Categories";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <main className="bg-white relative overflow-hidden ">
        <Navbar />
        <div className="bg-white flex relative z-2 items-center overflow-hidden">
          <div className="mx-auto w-full max-w-screen-lg px-6 flex flex-col lg:flex-row relative py-20 pb-10">
            <div className="w-full lg:w-2/5 flex flex-col relative z-20 mb-10 lg:mb-0">
              <span className="w-20 h-2 bg-gray-500 mb-30"></span>
              <h1 className="font-mono uppercase text-6xl sm:text-7xl font-extrabold tracking-wide flex flex-col leading-none text-gray-800">
                Vivi il
                <span className="text-5xl sm:text-7xl"> dettaglio</span>
              </h1>

              <p className="text-sm sm:text-base text-gray-700 mt-4">
                Ogni suono, ogni pixel, ogni istante.
              </p>
              <div className="flex mt-8">
                <a
                  href="https://celestique.onrender.com/audio"
                  className="uppercase py-2 px-4 rounded-lg bg-yellow-200 border-2 border-transparent text-black text-md mr-4 hover:bg-yellow-400"
                >
                  Acquista le nuove Beats
                </a>
                <a
                  href="https://celestique.onrender.com/prodotti"
                  className="uppercase py-2 px-4 rounded-lg bg-transparent border-2 border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white text-md"
                >
                  Esplora il negozio
                </a>
              </div>
            </div>

            <div className="w-full lg:w-3/5 flex justify-center">
              <img
                src="https://www.beatsbydre.com/content/dam/beats/web/product/headphones/studiopro-wireless/pdp/studiopro-pdp-p12.png.large.2x.png"
                className="max-w-xs md:max-w-sm"
                alt="illustration"
              />
            </div>
          </div>
        </div>
      </main>
      <Banner />
      <Categories />
      <Footer />
    </>
  );
}

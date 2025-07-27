import { useState } from "react";
import "./App.css";
import Header from "./components/header";
import Form from "./components/Form";
import Photogrid from "./components/Photogrid";
//import Photogrid from "./components/Photogrid";

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

if (!UNSPLASH_ACCESS_KEY) {
  console.error("Manca la chiave API di Unsplash!");
}

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Gestisce sarchbar
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setErrorMessage("");
  };

  // Gestisce il submit del form detchando le immagini in base al valore passato dall'input
  const handleSearchSubmit = async (event) => {
    event.preventDefault(); // Impedisce il ricaricamento della pagina

    // Controllo per evitare query vuote
    if (!searchQuery.trim()) {
      setErrorMessage(
        "Oops! It looks like your search field is empty. Try typing something!"
      );
      setImages([]); // Svuoto la moodboard quando l'input è vuoto
      return;
    }

    const url = `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=8&client_id=${UNSPLASH_ACCESS_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setImages(data.results);
      console.log(data.results);
    } catch (error) {
      console.error("Errore nel fetch:", error);
    }
  };

  return (
    <>
      {/* headr */}
      <Header
        title="Mood Board App"
        description="Type a term or a prompt to manifest your visual inspiration"
      />

      {/* form */}
      <Form
        handleSearchChange={handleSearchChange}
        searchQuery={searchQuery}
        handleSearchSubmit={handleSearchSubmit}
        errorMessage={errorMessage}
      />

      {/* Moodboard grid */}
      <Photogrid images={images} />
    </>
  );
}

export default App;

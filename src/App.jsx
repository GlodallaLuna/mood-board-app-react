import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/header";
import Form from "./components/Form";
import Photogrid from "./components/Photogrid";
import PresetBox from "./components/PresetBox";
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

if (!UNSPLASH_ACCESS_KEY) {
  console.error("Manca la chiave API di Unsplash!");
}

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const initialPresetPrompts = [
    { id: "autumn", query: "Red Sunset Autumn", title: "Red Sunset Autumn" },
    {
      id: "winter",
      query: "Icy blue, crisp white, silver grey winter landscape",
      title: "Icy Blue Winter",
    },
    {
      id: "spring",
      query:
        "Soft pastel pink, fresh mint green, clear sky blue blooming spring flowers",
      title: "Soft Pastel Spring",
    },
    {
      id: "summer",
      query: "Vibrant turquoise, sunny yellow, coral red summer beach vacation",
      title: "Vibrant Warm Summer",
    },
  ];
  const [loadedPresetPrompts, setLoadedPresetPrompts] = useState([]);

  //logica per render iniziale
  //Fetcha img per ogni presetPrompt al primo render
  useEffect(() => {
    const fetchInitialPresetCovers = async () => {
      const fetchedData = []; // Array temporaneo per costruire i dati completi

      for (const prompt of initialPresetPrompts) {
        // Iteriamo sui prompt originali
        const url = `https://api.unsplash.com/search/photos?query=${prompt.query}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`;

        try {
          const response = await fetch(url);
          const data = await response.json();

          if (data.results && data.results.length > 0) {
            fetchedData.push({
              ...prompt, // Copia id e query
              imageUrl: data.results[0].urls.regular, // fetcho prima img
            });
          } else {
            // aggiunge l'oggetto con un placeholder
            fetchedData.push({ ...prompt, imageUrl: null });
          }
        } catch (error) {
          console.error("Errore nel fetch:", error);
          fetchedData.push({ ...prompt, imageUrl: null }); // In caso di errore, aggiunge un placeholder
        }
      }
      setLoadedPresetPrompts(fetchedData); // Aggiorna lo stato UNA SOLA VOLTA dopo tutti i fetch
    };

    fetchInitialPresetCovers(); // Chiama la funzione async
  }, []);

  //logica per render griglia
  //funzione core per gestire il fetch delle immagini
  const fetchRenderImages = async (query) => {
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=12&client_id=${UNSPLASH_ACCESS_KEY}`;

    //fa partire il caricamento e resetta errori
    setLoadingState(true);
    setErrorMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setImages(data.results);
      } else {
        setImages([]); // Assicura che la griglia sia vuota
        setErrorMessage(
          "Sorry, no images were found for your search. Try a different keyword!"
        );
      }
    } catch (error) {
      console.error("Errore nel fetch:", error);
      setImages([]);
      setErrorMessage(
        "Sorry, something went wrong while fetching images. Please try again!"
      );
    } finally {
      setLoadingState(false);
    }
  };

  // Gestisce valore del input e lo passa a searchQuery
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setErrorMessage("");
  };

  // Gestisce il submit del form
  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    // evita query vuote e nel caso segnala errore
    if (!searchQuery.trim()) {
      setErrorMessage(
        "Oops! It looks like your search field is empty. Try typing something!"
      );
      setImages([]); // Svuoto la moodboard quando l'input è vuoto
      return;
    }

    //chiama funzione core passandogli searchQuery
    fetchRenderImages(searchQuery);
  };

  //Gestisce valore dei preset e lo passa a searchQuery
  const handlePrestClick = (query) => {
    setSearchQuery(query); //tiene aggiornato il campo di ricerca
    fetchRenderImages(query); //chiama funzione core passandogli query
  };

  return (
    <div className="max-w">
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

      <div className="wrapper__preset-box">
        {loadedPresetPrompts.map((preset) => (
          <PresetBox
            key={preset.id}
            query={preset.query}
            imageUrl={preset.imageUrl}
            title={preset.title}
            onClick={() => handlePrestClick(preset.query)}
          />
        ))}
      </div>

      {/* Moodboard grid */}
      <Photogrid images={images} loading={loadingState} />
    </div>
  );
}

export default App;

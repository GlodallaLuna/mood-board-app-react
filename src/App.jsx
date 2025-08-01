import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/header";
import Form from "./components/Form";
import Moodboard from "./components/Moodboard";
import PresetBox from "./components/PresetBox";
import Footer from "./components/Footer";
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
    {
      id: "autumn",
      query: "Crimson Kyoto, red shrine, temples, sunset autumn",
      title: "Crimson Autumn in Japan",
    },
    {
      id: "winter",
      query: "Sweden, icy blue winter, snowy white landscape",
      title: "Icy Winter in Sweden",
    },
    {
      id: "spring",
      query: "Florence, Tuscany green spring, flowers, pink, wine",
      title: "Blooming Spring in Tuscany",
    },
    {
      id: "summer",
      query:
        "California, coral bay, vibrant turquoise, sunny yellow, orange, summer beach vacation",
      title: "Vibrant Summer in California",
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
      console.log(data.results);

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
        "Sorry, something went wrong while fetching images. Please try again later!"
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
    <div className="content">
      <div className="max-w content-wrapper">
        <Header title="Type a term or a prompt to manifest your visual inspiration" />
        <Form
          handleSearchChange={handleSearchChange}
          searchQuery={searchQuery}
          handleSearchSubmit={handleSearchSubmit}
          errorMessage={errorMessage}
        />

        <div className="section-preset">
          {/* Mostra questo div solo quando i preset sono stati caricati */}
          {loadedPresetPrompts.length > 0 && (
            <>
              <p className="intro">Feeling uninspired? Pick a preset.</p>
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
            </>
          )}
        </div>

        {/* Condizionale spinner */}
        {loadingState ? (
          <div className="spinner-container">
            <svg
              className="spinner"
              width="65px"
              height="65px"
              viewBox="0 0 66 66"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="path"
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
                cx="33"
                cy="33"
                r="30"
              ></circle>
            </svg>
            <p className="loading-text">Loading inspiration...</p>
          </div>
        ) : (
          // Mostra la moodboard solo se ci sono immagini, altrimenti mostra l'errore
          <>
            {errorMessage && (
              <div className="error-message">
                <p>{errorMessage}</p>
              </div>
            )}
            {images.length > 0 && (
              <Moodboard images={images} loading={loadingState} />
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;

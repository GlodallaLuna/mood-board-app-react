import { useState } from "react";

const Photogrid = (props) => {
  return (
    <section>
      <div className="mood-board">
        {props.loading ? (
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
          <ul className="mood-board-content" aria-label="Mood board gallery">
            {props.images.map((img) => (
              <li key={img.id}>
                <ImageWithEffect
                  src={img.urls.full}
                  alt={img.alt_description}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

// Nuovo componente per effetto visivo sulle immagini
const ImageWithEffect = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="image-wrapper">
      <img
        src={src}
        alt={alt}
        className={`mood-board-img ${loaded ? "loaded" : ""}`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </div>
  );
};

export default Photogrid;

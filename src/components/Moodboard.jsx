import { useState } from "react";

const Photogrid = (props) => {
  return (
    <section>
      <div className="mood-board">
        <>
          <div class="wave-container">
            <p class="wave-text">
              <span>s</span>
              <span>c</span>
              <span>r</span>
              <span>o</span>
              <span>l</span>
              <span>l</span>
            </p>
            <p className="chevron">&#8964;</p>
          </div>

          <ul className="mood-board-content" aria-label="Mood board gallery">
            {props.images.map((img) => (
              <li key={img.id}>
                <ImageWithEffect
                  src={img.urls.full}
                  alt={img.alt_description}
                  name={img.user.first_name}
                  surname={img.user.last_name}
                  username={img.user.instagram_username}
                />
              </li>
            ))}
          </ul>
        </>
      </div>
    </section>
  );
};

// Minicomponente per gestire lo stato loaded per ogni immagini aggirando map
const ImageWithEffect = (props) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="image-wrapper">
      <img
        src={props.src}
        alt={props.alt}
        className={`mood-board-img ${loaded ? "loaded" : ""}`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />

      {loaded && (
        <div className="overlay-text">
          <p>
            {props.name} {props.surname}
          </p>

          {props.username && <p>@{props.username}</p>}
        </div>
      )}
    </div>
  );
};

export default Photogrid;

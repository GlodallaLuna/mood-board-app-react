const Photogrid = (props) => {
  return (
    <section>
      <h2>Your Visual Inspiration</h2>
      <div className="mood-board">
        <ul className="mood-board-content" aria-label="Mood board gallery">
          {props.images.map((img) => (
            <li key={img.id}>
              <img
                className="mood-board-img"
                src={img.urls.full}
                alt={img.alt_description}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Photogrid;

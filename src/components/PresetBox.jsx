const PresetBox = (props) => {
  return (
    <div className="preset-box" onClick={props.onClick}>
      <h2 className="subtitle">{props.title}</h2>
      <img src={props.imageUrl} alt="{props.query}" />
    </div>
  );
};

export default PresetBox;

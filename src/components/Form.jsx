const Form = (props) => {
  return (
    <form onSubmit={props.handleSearchSubmit}>
      <section className="search-bar">
        <input
          type="text"
          value={props.searchQuery}
          onChange={props.handleSearchChange}
          placeholder="Cerca un mood..."
        />

        {props.errorMessage && (
          <p className="error-message">{props.errorMessage}</p>
        )}

        <button type="submit">Create</button>
      </section>
    </form>
  );
};

export default Form;

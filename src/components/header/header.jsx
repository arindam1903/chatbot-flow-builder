import styles from  "./header.module.css";
const Header = ({ showSaveError, saveData, showSaveSuccess }) => {
  // showSaveError -> shows error on save
  // saveData -> handle save diagram functionality
  // showSaveSuccess -> shows success on save
  return (
    <header className={styles.header}>
      {(showSaveSuccess && (
        <button className="save-button success">Saved successfully!</button>
      )) ||
        (showSaveError && (
          <button className="save-button error-button">
            Cannot save flow!
          </button>
        )) ||
        "Chatbot Flow Builder"}
      <button className="save-button" onClick={() => saveData()}>
        Save Changes
      </button>
    </header>
  );
};
export default Header;

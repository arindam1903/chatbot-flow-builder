import { useEffect, useState } from "react";
import GoBackIcon from "../../assets/icons/goBack.svg";

const NodePanel = ({ message, saveMessage, cancelEdit, deleteNode }) => {
    // handling node message updation
    const [value, setValue] = useState(message || "");
    useEffect(() => {
      setValue(message);
    }, [message]);
    return (
      <div className="settings">
        <div className="settings-header">
          <span
            onClick={() => {
              cancelEdit();
            }}
          >
           <img src={GoBackIcon} alt='message' />
          </span>
          <div className="middle">Message</div>
        </div>
        <div className="settings-body">
          <div className="gray-text">Text</div>
          <textarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              saveMessage(e.target.value);
            }}
          />
        </div>
        <div className="settings-footer">
          <button
            className="delete-node-button"
            onClick={() => {
              deleteNode();
            }}
          >
            Delete Node
          </button>
          <button
            className="cancel-settings-button"
            onClick={() => {
              cancelEdit();
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  export default NodePanel;
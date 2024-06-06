import AudioIcon from "../../assets/icons/audio.svg";
import ImageIcon from "../../assets/icons/image.svg";
import MessageChatIcon from "../../assets/icons/messageChat.svg";
const Settings = () => {
    // handling message node addition from panel by dragging
    // image and audio is disabled as of now
    const onDragStart = (event, nodeType) => {
      event.dataTransfer.setData("application/reactflow", nodeType);
      event.dataTransfer.effectAllowed = "move";
    };
  
    return (
      <div className="sidebar">
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, "default")}
          draggable
        >
          <img src={MessageChatIcon} alt='message' />
          Message
        </div>
        <div className="dndnode disabled">
        <img src={ImageIcon} alt='message' />
          Images
        </div>
        <div className="dndnode disabled">
        <img src={AudioIcon} alt='message' />
          Audio
        </div>
      </div>
    );
  };
  export default Settings;
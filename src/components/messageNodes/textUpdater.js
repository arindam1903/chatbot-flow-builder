import { Handle, Position } from "reactflow";
import "./textUpdater.css";
import MessageIcon from "../../assets/icons/message.svg";


function TextUpdaterNode({ data, isConnectable, selected }) {
  // handle individual nodes on flow diagram
  return (
    <div className={`text-updater-node ${selected && "isSelected"}`}>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <div className="node-header">
        <img src={MessageIcon} alt='message' />
        Send Message
      </div>
      <div className="node-text">{data.label ? data.label : ""}</div>
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default TextUpdaterNode;

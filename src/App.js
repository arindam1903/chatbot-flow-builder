import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import "./index.css";
import TextUpdaterNode from "./components/messageNodes/textUpdater.js";
import Header from "./components/header/header.jsx";
import Settings from "./components/sidebar/settings.jsx";
import NodePanel from "./components/sidebar/nodePanel.jsx";

const nodeTypes = { textUpdater: TextUpdaterNode }; // importing custom node types
const initialNodes = []; // initializing nodes

const FlowDiagram = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showSaveError, setShowSaveError] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // handle edge connect between nodes
  const onConnect = useCallback((params) => {
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        },
        eds.filter((item) => item.source !== params.source)
      )
    );
  }, []);

  // handle drag over
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // handle drop of node over the diagram
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: uuidv4(),
        position,
        type: "textUpdater",
        data: { label: `` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  // storing id of clicked node to update the message
  const onNodeClick = useCallback((event, node) => {
    event.stopPropagation();
    setSelectedNode({ ...node });
  }, []);

  // updating node message on editing in the settings panel
  const saveMessage = useCallback(
    (message, node) => {
      let tempNodes = JSON.parse(JSON.stringify(nodes));
      tempNodes.forEach((item) => {
        if (item.id === node.id) {
          item.data.label = message;
        }
      });
      setNodes(JSON.parse(JSON.stringify(tempNodes)));
    },
    [nodes, setNodes]
  );

  // deleting particular node
  const deleteNode = useCallback(
    (node) => {
      setSelectedNode(null);
      let tempNodes = JSON.parse(JSON.stringify(nodes));
      let tempEdges = JSON.parse(JSON.stringify(edges));
      setNodes(
        JSON.parse(
          JSON.stringify(tempNodes.filter((item) => item.id !== node.id))
        )
      );
      setEdges(
        JSON.parse(
          JSON.stringify(
            tempEdges.filter(
              (item) => item.source !== node.id && item.target !== node.id
            )
          )
        )
      );
    },
    [nodes, setNodes, edges, setEdges]
  );

  // checking conditions to save the data, if not satisfying the conditions, showing error for 5 sec
  const saveData = () => {
    if (nodes.length > 1) {
      let tempEdges = {};
      for (let i = 0; i < edges.length; i++) {
        tempEdges[edges[i].target] = true;
      }
      if (nodes.length > Object.keys(tempEdges).length + 1) {
        setShowSaveError(true);
        setTimeout(() => {
          setShowSaveError(false);
        }, 5000);
        return;
      }
    }
    saveDataToLocalStorage();
  };

  // saving the data in localstorage, showing success message for 5 sec
  const saveDataToLocalStorage = () => {
    localStorage.setItem("nodes", JSON.stringify(nodes));
    localStorage.setItem("edges", JSON.stringify(edges));
    setShowSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 5000);
  };

  useEffect(() => {
    // on first load, checking if existing data is present in local storage (which is saved earlier),
    // if present, updating the states
    if (localStorage.getItem("nodes") && localStorage.getItem("edges")) {
      setNodes(JSON.parse(localStorage.getItem("nodes")));
      setEdges(JSON.parse(localStorage.getItem("edges")));
    }

    // capturing clicks outside node to close editing mode of node message
    reactFlowWrapper?.current?.addEventListener("click", () => {
      setSelectedNode(null);
    });
    return () => {
      reactFlowWrapper?.current?.removeEventListener("click", () => {
        setSelectedNode(null);
      });
    };
  }, []);
  
  return (
    <div className="dndflow">
      <Header
        showSaveError={showSaveError}
        showSaveSuccess={showSaveSuccess}
        saveData={saveData}
      />
      <div className="body-container">
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onNodeClick={onNodeClick}
              onDrop={onDrop}
              nodeTypes={nodeTypes}
              onDragOver={onDragOver}
              fitView
            >
              <Controls />
            </ReactFlow>
          </div>
          <div className="sidebar-container">
            {selectedNode?.id ? (
              <NodePanel
                deleteNode={() => {
                  deleteNode(selectedNode);
                }}
                cancelEdit={() => {
                  setSelectedNode(null);
                }}
                saveMessage={(text) => saveMessage(text, selectedNode)}
                message={selectedNode.data.label}
              />
            ) : (
              <Settings />
            )}
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default FlowDiagram;

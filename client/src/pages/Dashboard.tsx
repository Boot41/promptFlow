import React, { useRef } from "react";
import { ReactFlowProvider, Edge } from "@xyflow/react";
import Sidebar from "../components/Dashboard/Sidebar";
import Canvas from "../components/Dashboard/Canvas/Canvas";
import NodesPanel from "../components/Dashboard/Canvas/NodesPanel";
import { useFlowStore } from "../stores/useFlowStore";

const Dashboard: React.FC = () => {
  const edgeReconnectSuccessful = useRef<boolean>(true);

  // Get Zustand store functions & state
  const {
    nodes,
    edges,
    nodeValues,
    addNode,
    removeNode,
    updateNodeValue,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onReconnect,
  } = useFlowStore();

  const onReconnectStart = () => {
    edgeReconnectSuccessful.current = false;
  };

  const onReconnectEnd = (_: unknown, edge: Edge) => {
    if (!edgeReconnectSuccessful.current) {
      removeNode(edge.id);
    }
    edgeReconnectSuccessful.current = true;
  };

  return (
    <div style={{ height: "100vh", width: "100%", display: "flex" }}>
      {/* Sidebar with a fixed width */}
      <div style={{ width: "250px" }}>
        <Sidebar />
      </div>

      {/* Canvas and Nodes Panel will take up the remaining space */}
      <div style={{ flexGrow: 1, height: "100%", overflow: "hidden" }}>
        <ReactFlowProvider>
          <NodesPanel />
          <Canvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onReconnect={onReconnect}
            onReconnectStart={onReconnectStart}
            onReconnectEnd={onReconnectEnd}
            addNode={addNode}
            removeNode={removeNode}
            onNodeValueChange={updateNodeValue}
            nodeValues={nodeValues}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default Dashboard;

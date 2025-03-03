import React, { useState, useCallback, useRef } from "react";
import {
  ReactFlowProvider,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  reconnectEdge,
  addEdge,
} from "@xyflow/react";
import Sidebar from "../components/Dashboard/Sidebar";
import Canvas from "../components/Dashboard/Canvas";
import NodesPanel from "../components/Dashboard/NodesPanel";

// Initial nodes and edges for React Flow
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const Dashboard: React.FC = () => {
  const edgeReconnectSuccessful = useRef<boolean>(true);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  // Handle node changes
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // Handle edge changes
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Handle new connection (edge)
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    []
  );

  // Handle edge reconnection
  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeReconnectSuccessful.current = true;
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    },
    []
  );

  const onReconnectEnd = useCallback(
    (_: unknown, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }

      edgeReconnectSuccessful.current = true;
    },
    []
  );

  // Add a new node
  const addNode = useCallback((newNode: Node) => {
    setNodes((nds) => [...nds, newNode]);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%", display: "flex" }}>
      {/* Sidebar with a fixed width */}
      <div style={{ width: "250px" }}>
        <Sidebar />
      </div>

      {/* Canvas and Nodes Panel will take up the remaining space */}
      <div style={{ flexGrow: 1, height: "100%", overflow: "hidden" }}>
        <ReactFlowProvider>
          {/* NodesPanel will manage the sidebar content */}
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
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default Dashboard;

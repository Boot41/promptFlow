import React, { createContext, useContext, useState, useCallback, useRef } from "react";
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
import Canvas from "../components/Dashboard/Canvas/Canvas";
import NodesPanel from "../components/Dashboard/Canvas/NodesPanel";
import { FlowDataContext } from "../helpers/FlowDataContext";

// Initial nodes and edges for React Flow
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const Dashboard: React.FC = () => {
  const edgeReconnectSuccessful = useRef<boolean>(true);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  // Add state for node values
  const [nodeValues, setNodeValues] = useState<Record<string, any>>({});

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
    // Initialize node value if needed
    setNodeValues(prev => ({
      ...prev,
      [newNode.id]: newNode.data?.value || ""
    }));
    
    setNodes((nds) => [...nds, newNode]);
  }, []);

  // Remove a node and its connections
  const removeNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    
    // Clean up the node value when removing a node
    setNodeValues(prev => {
      const newValues = {...prev};
      delete newValues[nodeId];
      return newValues;
    });
  }, []);

  // Handle node value changes
  const handleNodeValueChange = useCallback((nodeId: string, value: any) => {
    setNodeValues(prev => ({
      ...prev,
      [nodeId]: value
    }));
  }, []);

  const flowDataValue = {
    nodes,
    edges,
    nodeValues 
  }

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
          <FlowDataContext.Provider value={flowDataValue}>
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
              onNodeValueChange={handleNodeValueChange}
              nodeValues={nodeValues}
            />
          </FlowDataContext.Provider>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default Dashboard;
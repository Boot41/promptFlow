import { 
  ReactFlow, 
  Controls, 
  Background, 
  useReactFlow, 
  Node, 
  Edge, 
  OnNodesChange, 
  OnEdgesChange,
  Connection,
  ConnectionLineType,
  Panel
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useRef } from "react";
import { Play, Save } from 'lucide-react'
import { runWorkflow } from "../../../services/api";
import { JSONInputNode } from "./Nodes/JSONInputNode";
import { TextInputNode } from "./Nodes/TextInputNode";
import { FileInputNode } from "./Nodes/FileInputNode";
import { APICallNode } from "./Nodes/APICallNode";
import { LogicNode } from "./Nodes/LogicNode";
import { PromptNode } from "./Nodes/PromptNode";
// import { JSONOutputNode } from "./Nodes/JSONOutputNode";
import { TextOutputNode, JSONOutputNode, FileOutputNode } from "./Nodes/TextOutputNode";
// import { FileOutputNode } from "./Nodes/FileOutputNode";
import { useWorkflowResultStore, useFlowStore } from "../../../stores/useFlowStore";

const nodeTypes = {
  textInput: TextInputNode,
  apiCall: APICallNode,
  jsonInput: JSONInputNode,
  fileInput: FileInputNode,
  promptNode: PromptNode,
  logicNode: LogicNode,
  jsonOutput: JSONOutputNode,
  textOutput: TextOutputNode,
  fileOutput: FileOutputNode
};

// Create a wrapper component that will connect to the store
const FlowCanvas = () => {
  // Get flow data and actions from the store
  const nodes = useFlowStore(state => state.nodes);
  const edges = useFlowStore(state => state.edges);
  const nodeValues = useFlowStore(state => state.nodeValues);
  const onNodesChange = useFlowStore(state => state.onNodesChange);
  const onEdgesChange = useFlowStore(state => state.onEdgesChange);
  const onConnect = useFlowStore(state => state.onConnect);
  const addNode = useFlowStore(state => state.addNode);
  const removeNode = useFlowStore(state => state.removeNode);
  const updateNodeValue = useFlowStore(state => state.updateNodeValue);
  const onReconnect = useFlowStore(state => state.onReconnect);

  // These are not in the store, so we'll create local handlers
  const reconnectingEdge = useRef<Edge | null>(null);
  
  const onReconnectStart = useCallback(() => {
    // Store the edge that is being reconnected
    reconnectingEdge.current = null;
  }, []);

  const onReconnectEnd = useCallback((_: unknown, edge: Edge) => {
    // Store the edge that was reconnected
    reconnectingEdge.current = edge;
  }, []);

  return (
    <Canvas
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      addNode={addNode}
      onReconnect={onReconnect}
      onReconnectStart={onReconnectStart}
      onReconnectEnd={onReconnectEnd}
      removeNode={removeNode}
      onNodeValueChange={updateNodeValue}
      nodeValues={nodeValues}
    />
  );
};

interface CanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  addNode?: (node: Node) => void;
  onReconnect: (oldEdge: Edge, newConnection: Connection) => void;
  onReconnectStart: () => void;
  onReconnectEnd: (_: unknown, edge: Edge) => void;
  removeNode?: (nodeId: string) => void;
  onNodeValueChange?: (nodeId: string, value: any) => void;
  nodeValues?: Record<string, any>;
}

export default function Canvas({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onConnect,
  addNode,
  onReconnect,
  onReconnectStart,
  onReconnectEnd,
  removeNode: propRemoveNode,
  onNodeValueChange,
  nodeValues = {}
}: CanvasProps): JSX.Element {
  const reactFlowInstance = useReactFlow();
  const edgeReconnectSuccessful = useRef<boolean>(true);
  
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      const label = event.dataTransfer.getData("application/reactflow/label");
      
      // Validate the dropped element
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `node_${Date.now()}`,
        type,
        position,
        data: { label },
        draggable: true,
        connectable: true,
      };

      if (addNode) addNode(newNode);
    },
    [addNode, reactFlowInstance]
  );

  // Use the provided removeNode prop if available, otherwise create a local implementation
  const handleRemoveNode = useCallback((nodeId: string) => {
    if (propRemoveNode) {
      propRemoveNode(nodeId);
    } else {
      onNodesChange([{ id: nodeId, type: "remove" }]);
    }
  }, [propRemoveNode, onNodesChange]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleNodeValueChange = useCallback((nodeId: string, value: string) => {
    if (onNodeValueChange) {
      onNodeValueChange(nodeId, value);
    }
  }, [onNodeValueChange]);


  const handleRunWorkFlow = async() => {
    // Get the workflow store functions
    const { storeResult, setLoading, setError } = useWorkflowResultStore.getState();
    
    // Set loading state
    setLoading(true);
    
    // Get the current state of the flow
    console.log("Running workflow with nodes: ", nodes)
    console.log("Edges: ", edges)
    console.log("Node values: ", nodeValues)
  
    try {
      const result = await runWorkflow(nodes, edges, nodeValues);
      
      // Store the result in the global store
      storeResult(result);
      
      return result;
    } catch(error) {
      console.log("Error running workflow: ", error)
      
      // Store the error in the global store
      setError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const handleSaveWorkflow = () => {
    const workflowData = {
      nodes,
      edges,
      nodeValues,
    };
    console.log("Saving workflow:", workflowData);
    // Implement save logic here (e.g., send to backend)
  };

  return (
    <div 
      style={{ width: "100%", height: "100%" }}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow 
        nodes={nodes.map(node => ({ 
          ...node, 
          data: { 
            ...node.data, 
            removeNode: () => handleRemoveNode(node.id),
            onChange: (value: any) => handleNodeValueChange(node.id, value),
            value: nodeValues[node.id] || node.data.value || "",
            id: node.id
          } 
        }))}
        nodeTypes={nodeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onReconnectStart={onReconnectStart}
        onReconnectEnd={onReconnectEnd}
        style={{ width: "100%", height: "100%" }}
        connectionLineType={ConnectionLineType.Bezier}
        defaultEdgeOptions={{ 
          type: "default",
          style: { stroke: "#555", strokeWidth: 2 },
          animated: true
        }}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-left" className="bg-white p-3 my-2 rounded-md shadow-md space-y-2">
          <button 
            onClick={handleSaveWorkflow} 
            className="flex items-center gap-2 px-3 my-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <Save size={18} />
          </button>
          <button 
            onClick={handleRunWorkFlow} 
            className="flex items-center gap-2 px-3 my-2 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            <Play size={18} />
          </button>
        </Panel>
        <Panel position="bottom-center" className="bg-white p-2 rounded-md shadow-md">
          <div className="text-xs text-gray-500">
            <p>Drag nodes from the panel to the canvas</p>
            <p>Connect nodes by dragging from one handle to another</p>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

// Export both the connected component and the raw component
export { FlowCanvas, Canvas };
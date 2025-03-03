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
  onReconnectEnd
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

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div 
      style={{ width: "100%", height: "100%" }}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow 
        nodes={nodes}
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
        <Panel position="bottom-right" className="bg-white p-2 rounded-md shadow-md">
          <div className="text-xs text-gray-500">
            <p>Drag nodes from the panel to the canvas</p>
            <p>Connect nodes by dragging from one handle to another</p>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

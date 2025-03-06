import { create } from "zustand";
import { Node, Edge, applyNodeChanges, applyEdgeChanges, Connection, addEdge, reconnectEdge } from "@xyflow/react";

interface WorkflowResultState {
  result: any | null;
  isLoading: boolean;
  error: Error | null;
  
  // Actions for workflow results
  storeResult: (result: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  clearResult: () => void;
}

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  nodeValues: Record<string, any>;

  // Actions
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  updateNodeValue: (nodeId: string, value: any) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  onReconnect: (oldEdge: Edge, newConnection: Connection) => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  nodes: [],
  edges: [],
  nodeValues: {},

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
      nodeValues: { ...state.nodeValues, [node.id]: node.data?.value || "" },
    })),

  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      nodeValues: Object.fromEntries(
        Object.entries(state.nodeValues).filter(([id]) => id !== nodeId)
      ),
    })),

  updateNodeValue: (nodeId, value) =>
    set((state) => ({
      nodeValues: { ...state.nodeValues, [nodeId]: value },
    })),

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    })),

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  onConnect: (connection) =>
    set((state) => ({
      edges: addEdge(connection, state.edges),
    })),

  onReconnect: (oldEdge, newConnection) =>
    set((state) => ({
      edges: reconnectEdge(oldEdge, newConnection, state.edges),
    })),
}));


export const useWorkflowResultStore = create<WorkflowResultState>((set) => ({
  result: null,
  isLoading: false,
  error: null,
  
  storeResult: (result) => set({ result, isLoading: false, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  clearResult: () => set({ result: null, error: null, isLoading: false }),
}));


// src/context/FlowDataContext.tsx
import React, { createContext, useContext } from 'react';
import { Node, Edge } from '@xyflow/react';

interface FlowDataContextType {
  nodes: Node[];
  edges: Edge[];
  nodeValues: Record<string, any>;
}

export const FlowDataContext = createContext<FlowDataContextType | undefined>(undefined);

export const useFlowData = () => {
  const context = useContext(FlowDataContext);
  if (context === undefined) {
    throw new Error('useFlowData must be used within a FlowDataProvider');
  }
  return context;
};
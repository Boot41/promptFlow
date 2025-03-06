import { useState, useEffect, useRef } from "react";
import { XCircleIcon, FileJson, FileText, LoaderIcon, FileCheck } from "lucide-react";
import { Handle, Position } from "@xyflow/react";
import { useWorkflowResultStore } from "../../../../stores/useFlowStore";

export function JSONOutputNode({ data }: any) {
    return (
      <div className="relative p-4 bg-amber-50 rounded-md shadow-md border border-amber-300">
        {/* Delete Button */}
        <button
          className="absolute top-1 right-1 text-red-500 hover:text-red-700"
          onClick={() => data.removeNode(data.id)}
        >
          <XCircleIcon className="w-4 h-4" />
        </button>
  
        <div className="flex items-center mb-2">
          <FileJson className="mr-2 text-amber-600" size={18} />
          <label className="block text-sm font-medium text-amber-600">JSON Output</label>
        </div>
        
        <input
          type="text"
          placeholder="JSON output description..."
          className="w-full px-2 py-1 border rounded-md text-sm"
          value={data.value || ""}
          onChange={(e) => data.onChange(e.target.value)}
        />
        <Handle type="target" position={Position.Top} className="w-2 h-2 bg-amber-600" />
      </div>
    );
  }
  
  export function TextOutputNode({ data }: any) {
    const [output, setOutput] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Only subscribe to the result when it's available (don't cause rerenders on loading/error changes)
    const workflowResult = useWorkflowResultStore(state => state.result);
    
    // Use a ref to track if we've processed this specific result
    const processedResultRef = useRef<any>(null);
    
    useEffect(() => {
      // Skip processing if the result is the same object we already processed
      if (workflowResult === processedResultRef.current) {
        return;
      }
      
      // If there's a new result, process it
      if (workflowResult) {
        setIsLoading(true);
        
        // Use setTimeout to make this asynchronous and avoid blocking the UI
        setTimeout(() => {
          try {
            console.log("Processing result:", workflowResult);
            
            // Check if the result has the expected structure
            if (workflowResult.outputs && typeof workflowResult.outputs === 'object') {
              const nodeOutput = workflowResult.outputs[data.id];
              setOutput(nodeOutput !== undefined ? nodeOutput : 'No output available for this node');
            } else {
              // Handle case where result structure is different than expected
              console.log("Unexpected result structure:", workflowResult);
              setOutput(JSON.stringify(workflowResult, null, 2));
            }
            
            setError(null);
            // Mark this result as processed
            processedResultRef.current = workflowResult;
          } catch (err) {
            console.error("Error processing output:", err);
            setError('Error processing output data');
          } finally {
            setIsLoading(false);
          }
        }, 0);
      } else {
        // No result available
        setOutput(null);
        setError(null);
        processedResultRef.current = null;
      }
    }, [workflowResult, data.id]);
  
    return (
      <div className="relative p-4 bg-amber-50 rounded-md shadow-md border border-amber-300 min-w-[250px] max-w-[300px]">
        {/* Delete Button */}
        <button
          className="absolute top-1 right-1 text-red-500 hover:text-red-700"
          onClick={() => data.removeNode(data.id)}
        >
          <XCircleIcon className="w-4 h-4" />
        </button>
  
        <div className="flex items-center mb-2">
          <FileText className="mr-2 text-amber-600" size={18} />
          <label className="block text-sm font-medium text-amber-600">Text Output</label>
        </div>
        
        <div className="p-2 bg-amber-100 rounded-md min-h-[80px] max-h-[200px] overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center text-amber-600">
              <LoaderIcon className="mr-2 animate-spin" size={16} />
              <span className="text-sm">Loading...</span>
            </div>
          ) : error ? (
            <div className="text-red-600 text-sm">{error}</div>
          ) : (
            <pre className="text-xs text-amber-800 whitespace-pre-wrap break-words">
              {output || 'Output will be displayed here...'}
            </pre>
          )}
        </div>
  
        <Handle type="target" position={Position.Top} className="w-2 h-2 bg-amber-600" />
      </div>
    );
  }
  
  export function FileOutputNode({ data }: any) {
    return (
      <div className="relative p-4 bg-amber-50 rounded-md shadow-md border border-amber-300">
        {/* Delete Button */}
        <button
          className="absolute top-1 right-1 text-red-500 hover:text-red-700"
          onClick={() => data.removeNode(data.id)}
        >
          <XCircleIcon className="w-4 h-4" />
        </button>
  
        <div className="flex items-center mb-2">
          <FileCheck className="mr-2 text-amber-600" size={18} />
          <label className="block text-sm font-medium text-amber-600">File Output</label>
        </div>
        
        <input
          type="text"
          placeholder="File output description..."
          className="w-full px-2 py-1 border rounded-md text-sm"
          value={data.value || ""}
          onChange={(e) => data.onChange(e.target.value)}
        />
        <Handle type="target" position={Position.Top} className="w-2 h-2 bg-amber-600" />
      </div>
    );
  }
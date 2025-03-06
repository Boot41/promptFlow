import { XCircleIcon } from "lucide-react";
import { Handle, Position } from "@xyflow/react"; 
import { useRef, useEffect } from "react";

export function LogicNode({ data }: any) {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    
    // Update height on input change
    useEffect(() => {
      if (textAreaRef.current) {
        // Reset height to calculate the actual scrollHeight
        textAreaRef.current.style.height = "auto";
        
        // Set new height based on scrollHeight (plus a little extra padding)
        const newHeight = textAreaRef.current.scrollHeight;
        textAreaRef.current.style.height = `${newHeight}px`;
      }
    }, [data.value]);

    return (
      <div className="relative p-4 bg-indigo-50 rounded-md shadow-md border border-indigo-300 min-w-64 transition-all duration-200">
        {/* Delete Button */}
        <button
          className="absolute top-1 right-1 text-red-500 hover:text-red-700"
          onClick={() => data.removeNode(data.id)}
        >
          <XCircleIcon className="w-4 h-4" />
        </button>
  
        <label className="block text-sm font-medium mb-1 text-indigo-600">Logic node</label>
        <textarea
          ref={textAreaRef}
          placeholder="Enter logic..."
          className="w-full px-2 py-1 border rounded-md text-sm resize-none overflow-hidden"
          value={data.value || ""}
          onChange={(e) => {
            data.onChange(e.target.value);
          }}
          rows={1}
       />
        <Handle type="target" position={Position.Top} className="w-2 h-2 bg-indigo-600" />
        <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-indigo-600" />
      </div>
    );
  }
import { XCircleIcon } from "lucide-react";
import { Handle, Position } from "@xyflow/react";

export function JSONInputNode({ data }: any) {
    return (
      <div className="relative p-4 bg-green-50 rounded-md shadow-md border border-green-300">
        {/* Delete Button */}
        <button
          className="absolute top-1 right-1 text-red-500 hover:text-red-700"
          onClick={() => data.removeNode(data.id)}
        >
          <XCircleIcon className="w-4 h-4" />
        </button>
  
        <label className="block text-sm font-medium mb-1 text-green-600">JSON Input</label>
        <input
          type="text"
          placeholder="Enter JSON..."
          className="w-full px-2 py-1 border rounded-md text-sm"
          value={data.value || ""}
          onChange={(e) => data.onChange(e.target.value)}
        />
        <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-green-600" />
      </div>
    );
  }
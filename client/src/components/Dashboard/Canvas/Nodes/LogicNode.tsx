import { XCircleIcon } from "lucide-react";
import { Handle, Position } from "@xyflow/react";

export function LogicNode({ data }: any) {
    return (
      <div className="relative p-4 bg-indigo-50 rounded-md shadow-md border border-indigo-300">
        {/* Delete Button */}
        <button
          className="absolute top-1 right-1 text-red-500 hover:text-red-700"
          onClick={() => data.removeNode(data.id)}
        >
          <XCircleIcon className="w-4 h-4" />
        </button>
  
        <label className="block text-sm font-medium mb-1 text-indigo-600">Logic Node</label>
        <input
          type="text"
          placeholder="Enter logic..."
          className="w-full px-2 py-1 border rounded-md text-sm"
          value={data.value || ""}
          onChange={(e) => data.onChange(e.target.value)}
        />
        <Handle type="target" position={Position.Top} className="w-2 h-2 bg-indigo-600" />
        <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-indigo-600" />
      </div>
    );
  }
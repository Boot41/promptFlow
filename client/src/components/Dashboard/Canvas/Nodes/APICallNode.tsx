import { XCircleIcon } from "lucide-react";
import { Handle, Position } from "@xyflow/react"; 

const apiOptions = [
    { label: "Send Email", value: "email" },
    // { label: "Fetch Data", value: "fetch" },
    // { label: "Submit Form", value: "submit" },
  ];
  
  export function APICallNode({ data }: { 
    data: {
      id: string;
      label?: string;
      value?: string;
      removeNode: (id: string) => void;
      onChange: (value: string) => void;
    }
  }) {
    return (
      <div className="relative p-4 bg-indigo-50 rounded-md shadow-md border border-indigo-300 w-64">
        {/* Delete Button */}
        <button
          className="absolute top-1 right-1 text-red-500 hover:text-red-700"
          onClick={() => data.removeNode(data.id)}
          aria-label="Remove node"
        >
          <XCircleIcon className="w-4 h-4" />
        </button>
  
        <fieldset>
          <legend className="block text-sm font-medium mb-2 text-indigo-600">Actions</legend>
          
          <div className="space-y-2">
            {apiOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                  data.value === option.value
                    ? "bg-indigo-100 border-indigo-300 ring-2 ring-indigo-500"
                    : "bg-white hover:bg-indigo-50"
                } border`}
              >
                <input
                  type="radio"
                  name="apiOption"
                  value={option.value}
                  checked={data.value === option.value}
                  onChange={() => {
                    // Use the onChange method passed from the parent
                    data.onChange(option.value);
                  }}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
  
        <Handle 
          type="target" 
          position={Position.Top} 
          className="w-2 h-2 bg-indigo-600" 
        />
        <Handle 
          type="source" 
          position={Position.Bottom}  
          className="w-2 h-2 bg-indigo-600" 
        />
      </div>
    );
  }
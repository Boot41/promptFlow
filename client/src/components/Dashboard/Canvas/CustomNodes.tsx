import  { useRef, useState, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import { XCircleIcon, FileJson, FileText, FileCheck, LoaderIcon } from "lucide-react"; // Small delete icon

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

export function TextInputNode({ data }: any) {
  return (
    <div className="relative p-4 bg-green-50 rounded-md shadow-md border border-green-300">
      {/* Delete Button */}
      <button
        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
        onClick={() => data.removeNode(data.id)}
      >
        <XCircleIcon className="w-4 h-4" />
      </button>

      <label className="block text-sm font-medium mb-1 text-green-600">Text Input</label>
      <input
        type="text"
        placeholder="Enter text..."
        className="w-full px-2 py-1 border rounded-md text-sm"
        value={data.value || ""}
        onChange={(e) => data.onChange(e.target.value)}
      />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-green-600" />
    </div>
  );
}

export function FileInputNode({ data }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Convert FileList to array and store all files
      const filesArray = Array.from(files);
      data.onChange(filesArray);
    }
  };

  return (
    <div className="relative p-4 bg-green-50 rounded-md shadow-md border border-green-300">
      {/* Delete Button */}
      <button
        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
        onClick={() => data.removeNode(data.id)}
      >
        <XCircleIcon className="w-4 h-4" />
      </button>

      <label className="block text-sm font-medium mb-1 text-green-600">File Input</label>
      <input

        type="file"
        multiple
        className="w-full px-2 py-1 border rounded-md text-sm hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
      />

      <button
       onClick={() => fileInputRef.current?.click()}
       className="mt-2 text-white bg-green-600 px-4 py-2 rounded"
      >
        Upload Files
      </button>
      {data.value && (
        <p className="text-xs mt-2 text-green-600">
          {data.value.length > 1
            ? `${data.value.length} files selected`
            : data.value[0].name}
        </p>
      )}

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-green-600" />
    </div>
  );
}


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
        <legend className="block text-sm font-medium mb-2 text-indigo-600">Select API Call</legend>
        
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


export function PromptNode({ data }: any) {
  return (
    <div className="relative p-4 bg-indigo-50 rounded-md shadow-md border border-indigo-300">
      {/* Delete Button */}
      <button
        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
        onClick={() => data.removeNode(data.id)}
      >
        <XCircleIcon className="w-4 h-4" />
      </button>

      <label className="block text-sm font-medium mb-1 text-indigo-600">Instructions</label>
      <input
        type="text"
        placeholder="Enter instructions..."
        className="w-full px-2 py-1 border rounded-md text-sm"
        value={data.value || ""}
        onChange={(e) => data.onChange(e.target.value)}
      />
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-indigo-600" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-indigo-600" />
    </div>
  );
}

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

  useEffect(() => {
    // Check if the workflow result is already available
    if (data.workflowResult) {
      try {
        // Assuming the output is stored in data.workflowResult with a specific structure
        const nodeOutput = data.workflowResult.outputs?.[data.id];
        setOutput(nodeOutput || 'No output available');
        setIsLoading(false);
      } catch (err) {
        setError('Error processing output');
        setIsLoading(false);
      }
    } else {
      // If no result is available, reset state
      setOutput(null);
      setIsLoading(false);
      setError(null);
    }
  }, [data.workflowResult, data.id]);

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

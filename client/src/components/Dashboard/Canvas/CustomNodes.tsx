import  { useRef } from "react";
import { Handle, Position } from "@xyflow/react";
import { XCircleIcon } from "lucide-react"; // Small delete icon

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

export function APICallNode({ data }: any) {
  return (
    <div className="relative p-4 bg-indigo-50 rounded-md shadow-md border border-indigo-300">
      {/* Delete Button */}
      <button
        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
        onClick={() => data.removeNode(data.id)}
      >
        <XCircleIcon className="w-4 h-4" />
      </button>

      <label className="block text-sm font-medium mb-1 text-indigo-600">API Call</label>
      <input
        type="url"
        placeholder="Enter API URL..."
        className="w-full px-2 py-1 border rounded-md text-sm"
        value={data.url || ""}
        onChange={(e) => data.onChange(e.target.value)}
      />
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-indigo-600" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-indigo-600" />
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

      <label className="block text-sm font-medium mb-1 text-indigo-600">LLM Prompt</label>
      <input
        type="text"
        placeholder="Enter prompt..."
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

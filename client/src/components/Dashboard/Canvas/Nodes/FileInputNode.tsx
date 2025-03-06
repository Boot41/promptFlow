import { useRef } from "react";
import { XCircleIcon } from "lucide-react";
import { Handle, Position } from "@xyflow/react";

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
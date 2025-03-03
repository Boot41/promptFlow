import { useState } from "react";
import { ChevronDown, ChevronUp, Database, FileText } from "lucide-react";
import NodeItem from "./NodeItem";

export default function NodesPanel(): JSX.Element {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="absolute top-4 right-4 z-10 w-64 bg-white rounded-lg shadow-lg overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 bg-gray-100 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-medium">Node Library</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>
      
      {isOpen && (
        <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Data Elements</h4>
            <NodeItem type="input" label="Input" icon={<FileText size={18} />} />
            <NodeItem type="output" label="Output" icon={<FileText size={18} />} />
            <NodeItem type="default" label="Database" icon={<Database size={18} />} />
          </div>
        </div>
      )}
    </div>
  );
}
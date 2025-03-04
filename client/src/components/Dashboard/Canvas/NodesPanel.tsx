import { useState } from "react";
import { ChevronDown, ChevronUp, Database, FileText, Code, Zap, MessageSquare } from "lucide-react";
import NodeItem from "./NodeItem";

// Define all available nodes
const nodesList = [
  {
    category: "Input Fields",
    nodes: [
      { type: "jsonInput", label: "JSON Input", icon: <Code size={18} /> },
      { type: "textInput", label: "Text Input", icon: <FileText size={18} /> },
      { type: "fileInput", label: "File Input", icon: <Database size={18} /> },
    ],
  },
  {
    category: "Processing Fields",
    nodes: [
      { type: "apiCall", label: "API Call", icon: <Zap size={18} /> },
      { type: "promptNode", label: "Prompt Field", icon: <MessageSquare size={18} /> },
      { type: "logicNode", label: "Logic Field", icon: <Database size={18} /> },
    ],
  },
];

export default function NodesPanel(): JSX.Element {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="absolute top-4 right-4 z-10 w-64 bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 bg-gray-100 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-medium">Node Library</h3>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
      </div>

      {/* Node List */}
      {isOpen && (
        <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {nodesList.map((category, index) => (
            <div key={index} className="mb-4">
              <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">{category.category}</h4>
              {category.nodes.map((node) => (
                <NodeItem key={node.type} type={node.type} label={node.label} icon={node.icon} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

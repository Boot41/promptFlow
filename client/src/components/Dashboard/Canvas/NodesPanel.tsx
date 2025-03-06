import { useState } from "react";
import { ChevronDown, ChevronUp, Database, FileText, Code, Zap, MessageSquare, Text, File, Lightbulb, FileJson, FileCheck } from "lucide-react";
import NodeItem from "./NodeItem";

// Define all available nodes
const nodesList = [
  {
    category: "Input Fields",
    nodes: [
      { type: "jsonInput", label: "JSON Input", icon: <Code size={18} /> },
      { type: "textInput", label: "Text Input", icon: <Text size={18} /> },
      { type: "fileInput", label: "File Input", icon: <File size={18} /> },
    ],
  },
  {
    category: "Processing Fields",
    nodes: [
      { type: "apiCall", label: "Actions", icon: <Zap size={18} /> },
      { type: "promptNode", label: "Instruct Field", icon: <MessageSquare size={18} /> },
      { type: "logicNode", label: "Logic Field", icon: <Lightbulb size={18} /> },
    ],
  },
  {
    category: "Output Fields",
    nodes: [
      // { type: "jsonOutput", label: "JSON Output", icon: <FileJson size={18} /> },
      { type: "textOutput", label: "Text Output", icon: <FileText size={18} /> },
      // { type: "fileOutput", label: "File Output", icon: <FileCheck size={18} /> },
    ]
  }
];

export default function NodesPanel(): JSX.Element {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="absolute top-4 right-4 z-10 w-64 bg-white rounded-lg shadow-lg flex flex-col">
      {/* Header - Fixed at top */}
      <div
        className="flex items-center justify-between p-4 bg-gray-100 cursor-pointer border-b border-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-medium">Node Library</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>

      {/* Scrollable Content with Fixed Height */}
      {isOpen && (
        <div className="h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="p-4">
            {nodesList.map((category, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  index !== nodesList.length - 1 ? "border-b border-gray-100 pb-4" : ""
                }`}
              >
                <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-semibold">
                  {category.category}
                </h4>
                <div className="space-y-2">
                  {category.nodes.map((node) => (
                    <NodeItem
                      key={node.type}
                      type={node.type}
                      label={node.label}
                      icon={node.icon}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

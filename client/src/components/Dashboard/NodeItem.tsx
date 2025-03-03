import React from "react";

interface NodeItemProps {
  type: string;
  label: string;
  icon: React.ReactNode;
}

export default function NodeItem({ type, label, icon }: NodeItemProps): JSX.Element {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.setData("application/reactflow/label", label);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="flex items-center p-3 mb-2 bg-white rounded-md shadow-sm cursor-grab hover:bg-gray-50 transition-colors"
      onDragStart={onDragStart}
      draggable
    >
      <div className="mr-3 text-gray-600">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
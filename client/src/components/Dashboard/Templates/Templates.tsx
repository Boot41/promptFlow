import React from 'react';
import { ArrowRight, Box, GitBranch } from 'lucide-react';

const TemplatesView: React.FC = () => {
  // Sample templates data
  const templates = [
    { 
      id: 1, 
      name: 'Basic Workflow', 
      description: 'A simple starting workflow template perfect for beginners. Includes basic input processing and output handling.',
      nodes: ['Input', 'Process', 'Output'],
    },
    { 
      id: 2, 
      name: 'Advanced Data Pipeline', 
      description: 'Complex data transformation workflow with validation steps. Ideal for ETL processes and data warehousing.',
      nodes: ['Extract', 'Transform', 'Load', 'Validate'],
    },
    { 
      id: 3, 
      name: 'ML Training Pipeline', 
      description: 'Specialized workflow for machine learning model training with data preprocessing and evaluation steps.',
      nodes: ['Preprocess', 'Train', 'Evaluate', 'Deploy'],
    }
  ];

  const handleTemplateClick = (templateId: number) => {
    console.log(`Template ${templateId} selected`);
    // Handle template selection here
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <Box className="w-6 h-6 text-indigo-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-900">Workflow Templates</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div 
            key={template.id} 
            onClick={() => handleTemplateClick(template.id)}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100"
          >
            
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              {template.description}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <GitBranch className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">Workflow Nodes</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {template.nodes.map((node, index) => (
                  <div key={node} className="flex items-center">
                    <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium">
                      {node}
                    </span>
                    {index < template.nodes.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-300 mx-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <span className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center">
                Use Template
                <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesView;
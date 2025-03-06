import React from 'react';
import { ArrowRight, Box, GitBranch } from 'lucide-react';
import { useFlowStore, FlowTemplate } from '../../../stores/useFlowStore';

interface TemplatesViewProps {
  onTabChange?: (tab: 'Canvas' | 'Templates' | 'Settings') => void;
}

const TemplatesView: React.FC<TemplatesViewProps> = ({ onTabChange }) => {
  const createFlowFromTemplate = useFlowStore(state => state.createFlowFromTemplate);

  // Sample templates data
  const templates: FlowTemplate[] = [
    {
      id: 1,
      name: 'Resume Screening Pipeline',
      description: 'An HR workflow for automating resume screening against job descriptions, with AI-powered analysis and email extraction.',
      nodes: ['File Input', 'Prompt', 'API Call', 'Text Output'],
      nodesData: {
        'node_1': { 
          type: 'fileInput', 
          position: { x: 100, y: 100 },
          data: { label: 'File Input', value: '' }
        },
        'node_2': { 
          type: 'promptNode', 
          position: { x: 400, y: 100 },
          data: { 
            label: 'Prompt',
            value: "I'm an HR at Think41. Check if the resumes match the JD of Fullstack developer. If Yes, extract the emails."
          }
        },
        'node_3': { 
          type: 'apiCall', 
          position: { x: 700, y: 100 },
          data: { label: 'API Call', value: "email" }
        },
        'node_4': { 
          type: 'textOutput', 
          position: { x: 1000, y: 100 },
          data: { label: 'Text Output', value: '' }
        }
      },
      edges: [
        { source: 'node_1', target: 'node_2', animated: true },
        { source: 'node_2', target: 'node_3', animated: true },
        { source: 'node_3', target: 'node_4', animated: true }
      ]
    },
    {
      id: 2,
      name: 'Invoice Policy Validation',
      description: 'A workflow for validating invoices against a policy and extracting emails from the matching document.',
      nodes: ['File Input', 'Text Input', 'Prompt', 'Text Output'],
      nodesData: {
        'node_1741268699845': { 
          type: 'fileInput', 
          position: { x: 100, y: 100 },
          data: { label: 'File Input', value: '' }
        },
        'node_1741268980627': { 
          type: 'textInput', 
          position: { x: 400, y: 100 },
          data: { 
            label: 'Text Input',
            value: 'Policy: For the invoices to be valid the total must be strictly greater than 0'
          }
        },
        'node_1741268986979': { 
          type: 'promptNode', 
          position: { x: 700, y: 100 },
          data: { 
            label: 'Prompt',
            value: 'Compare the two files uploaded with the policy given. If the policy matches the document, extract the emails. Extract the email from only the document the policy matches.'
          }
        },
        'node_1741269073837': { 
          type: 'textOutput', 
          position: { x: 1000, y: 100 },
          data: { label: 'Text Output', value: '' }
        }
      },
      edges: [
        { source: 'node_1741268699845', target: 'node_1741268986979', animated: true },
        { source: 'node_1741268980627', target: 'node_1741268986979', animated: true },
        { source: 'node_1741268986979', target: 'node_1741269073837', animated: true }
      ]
    },
    {
      id: 3,
      name: 'Customer Complaint Resolution',
      description: 'A workflow for analyzing customer complaints, categorizing them by severity, determining response templates, and generating customer emails.',
      nodes: ['JSON Input', 'Prompt', 'Logic', 'Prompt', 'API Call', 'Text Output'],
      nodesData: {
        'node_1741273508526': { 
          type: 'jsonInput', 
          position: { x: 100, y: 100 },
          data: { label: 'Customer Complaints', value: '[...]' } // JSON data placeholder
        },
        'node_1741273297007': { 
          type: 'promptNode', 
          position: { x: 400, y: 100 },
          data: { 
            label: 'Analyze Complaints',
            value: 'Given these customer complaints, divide them on basis of severity and category and extract their emails whose severity is high.'
          }
        },
        'node_1741274631829': { 
          type: 'logicNode', 
          position: { x: 700, y: 100 },
          data: { 
            label: 'Determine Response',
            value: 'Determine an appropriate response template for the customer complaints.'
          }
        },
        'node_1741274750152': { 
          type: 'promptNode', 
          position: { x: 1000, y: 100 },
          data: { 
            label: 'Generate Response',
            value: 'Based on the response template, generate emails for the customer complaints.'
          }
        },
        'node_1741274829561': { 
          type: 'apiCall', 
          position: { x: 1300, y: 100 },
          data: { label: 'Email API', value: 'email' }
        },
        'node_1741274847607': { 
          type: 'textOutput', 
          position: { x: 1600, y: 100 },
          data: { label: 'Case Summary', value: '' }
        }
      },
      edges: [
        { source: 'node_1741273508526', target: 'node_1741273297007', animated: true },
        { source: 'node_1741273508526', target: 'node_1741274631829', animated: true },
        { source: 'node_1741273297007', target: 'node_1741274750152', animated: true },
        { source: 'node_1741274631829', target: 'node_1741274750152', animated: true },
        { source: 'node_1741274750152', target: 'node_1741274829561', animated: true },
        { source: 'node_1741274829561', target: 'node_1741274847607', animated: true }
      ]
    }
  ];

  const handleTemplateClick = (template: FlowTemplate) => {
    console.log(`Template ${template.id} selected`);
    // Create a new flow from the template
    createFlowFromTemplate(template);
    // Switch to Canvas tab if onTabChange is provided
    if (onTabChange) {
      onTabChange('Canvas');
    }
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
            onClick={() => handleTemplateClick(template)}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{template.name}</h3>
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
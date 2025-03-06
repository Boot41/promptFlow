import React from 'react';
import { Braces, GitBranch, GitMerge, MessageSquare, SplitSquareVertical, Zap, Workflow } from 'lucide-react';

const features = [
  {
    name: 'Visual Workflow Builder',
    description: 'Drag and drop nodes to create complex AI prompt workflows on an unlimited canvas.',
    icon: Workflow,
  },
  {
    name: 'Branching Logic',
    description: 'Create conditional paths based on prompt outputs or user-defined criteria.',
    icon: GitBranch,
  },
  {
    name: 'Merge Capabilities',
    description: 'Combine outputs from multiple prompts into a unified result.',
    icon: GitMerge,
  },
  // {
  //   name: 'Advanced Prompting',
  //   description: 'Design sophisticated prompts with variables, context, and formatting options.',
  //   icon: MessageSquare,
  // },
  // {
  //   name: 'Split & Transform',
  //   description: 'Split outputs and transform data between workflow steps.',
  //   icon: SplitSquareVertical,
  // },
  // {
  //   name: 'API Integration',
  //   description: 'Connect to external APIs and services to extend your workflow capabilities.',
  //   icon: Braces,
  // },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to build powerful AI workflows
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            PromptFlow provides all the tools to design, test, and deploy complex prompt-based workflows.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.name} className="pt-6">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8 h-full border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                      <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
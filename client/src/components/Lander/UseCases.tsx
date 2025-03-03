import React from 'react';
import { Layers, Zap, MessageSquare } from 'lucide-react';

const useCases = [
  {
    title: 'PlaceHolder',
    description: 'Placeholder',
    icon: Layers,
    color: 'bg-blue-500',
  }
  // {
  //   title: 'Content Generation Pipelines',
  //   description: 'Create multi-stage content generation workflows that refine outputs through multiple AI models and human review steps.',
  //   icon: Layers,
  //   color: 'bg-blue-500',
  // },
  // {
  //   title: 'Conversational AI Systems',
  //   description: 'Build complex chatbots with memory, context awareness, and specialized knowledge domains using branching conversation flows.',
  //   icon: MessageSquare,
  //   color: 'bg-green-500',
  // },
  // {
  //   title: 'Data Processing & Analysis',
  //   description: 'Transform raw data through AI processing steps with conditional logic based on content, sentiment, or other attributes.',
  //   icon: Zap,
  //   color: 'bg-purple-500',
  // },
];

const UseCases = () => {
  return (
    <section id="use-cases" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Use Cases</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Solve complex problems with PromptFlow
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            See how organizations are using PromptFlow to build sophisticated AI applications.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <div key={useCase.title} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-6 py-8">
                <div className={`inline-flex items-center justify-center rounded-md ${useCase.color} p-3 shadow-lg`}>
                  <useCase.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900">{useCase.title}</h3>
                <p className="mt-2 text-base text-gray-500">{useCase.description}</p>
              </div>
              <div className="px-6 py-3 bg-gray-50">
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    View example workflow <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Explore all use cases
          </a>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
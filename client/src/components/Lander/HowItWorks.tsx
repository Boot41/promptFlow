import React from 'react';
import { ChevronRight } from 'lucide-react';

const steps = [
  {
    id: '01',
    name: 'Placeholder',
    description: 'A placeholder for the first step.',
    imageSrc: '',
  },
  // {
  //   id: '01',
  //   name: 'Design Your Canvas',
  //   description: 'Start with a blank canvas and add input nodes to capture user data or system variables.',
  //   imageSrc: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80',
  // },
  // {
  //   id: '02',
  //   name: 'Add Prompt Nodes',
  //   description: 'Create prompt nodes with templates and connect them to inputs. Configure each prompt with specific instructions.',
  //   imageSrc: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  // },
  // {
  //   id: '03',
  //   name: 'Define Logic & Flow',
  //   description: 'Add conditional branches, splits, and merges to create complex decision trees based on prompt outputs.',
  //   imageSrc: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  // },
  // {
  //   id: '04',
  //   name: 'Test & Deploy',
  //   description: 'Test your workflow with sample inputs, refine as needed, and deploy as an API endpoint or embedded application.',
  //   imageSrc: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80',
  // },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-16">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Build powerful workflows in minutes
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Follow these simple steps to create, test, and deploy your AI prompt workflows.
          </p>
        </div>

        <div className="space-y-16">
          {steps.map((step, stepIdx) => (
            <div
              key={step.id}
              className={`flex flex-col ${
                stepIdx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center`}
            >
              <div className="flex-1">
                <div className="lg:max-w-md">
                  <span className="text-indigo-600 text-sm font-bold tracking-widest">STEP {step.id}</span>
                  <h3 className="mt-2 text-2xl font-extrabold text-gray-900">{step.name}</h3>
                  <p className="mt-3 text-lg text-gray-500">{step.description}</p>
                </div>
              </div>
              <div className="flex-1 mt-10 lg:mt-0 lg:ml-8 lg:mr-8">
                <img
                  className="rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 w-full h-64 object-cover"
                  src={step.imageSrc}
                  alt={step.name}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
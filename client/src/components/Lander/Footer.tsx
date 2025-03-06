import React from 'react';
import { Workflow } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="flex items-center">
            <Workflow className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">PromptFlow</span>
          </div>
        </div>
        <nav className="mt-8 flex flex-wrap justify-center" aria-label="Footer">
          {/* <div className='px-5 py-2'>
            <a href="#" className="text-base text-gray-500 hover:text-gray-900">
              Placeholder
            </a>
          </div> */}
          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-500 hover:text-gray-900">
              About
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-500 hover:text-gray-900">
              Features
            </a>
          </div>
          {/* <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-500 hover:text-gray-900">
              Pricing
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-500 hover:text-gray-900">
              Documentation
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-500 hover:text-gray-900">
              Blog
            </a>
          </div>
          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-500 hover:text-gray-900">
              Contact
            </a>
          </div> */}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
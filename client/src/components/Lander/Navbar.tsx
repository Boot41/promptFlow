import React, { useState } from 'react';
import { Workflow, Menu, X } from 'lucide-react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

interface User {
  id: number;
  username: string;
  email: string; 
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const openModal = (type: string) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType('');
  };

  const handleLoginSuccess = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    closeModal(); // Close modal after successful login/signup
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Workflow className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">PromptFlow</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#use-cases" className="text-gray-700 hover:text-indigo-600 transition-colors">Use Cases</a>
            <button 
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              onClick={() => openModal('login')}
            >
              Get Started
            </button>
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a 
              href="#features" 
              className="block px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="block px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#use-cases" 
              className="block px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Use Cases
            </a>
            <button 
              className="w-full text-left px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              onClick={() => openModal('login')}
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {modalType === "login" && (
        <LoginModal isOpen={isModalOpen} closeModal={closeModal} onLoginSuccess={handleLoginSuccess} onOpenSignup={() => openModal("signup")} />
      )}
      {modalType === "signup" && (
        <SignupModal isOpen={isModalOpen} closeModal={closeModal} onLoginSuccess={handleLoginSuccess} />
      )}
    </nav>
  );
};

export default Navbar;
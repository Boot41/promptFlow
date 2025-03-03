import React, { useState } from 'react';
import { Home, LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth';

type SidebarItemProps = {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick?: () => void;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, active, onClick }) => {
  return (
    <li 
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
        active 
          ? 'bg-indigo-100 text-indigo-700' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <div className="mr-3">{icon}</div>
      <span className="font-medium">{text}</span>
    </li>
  );
};

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>('Canvas');
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout(); // assuming logout is a function that returns a Promise
      navigate("/"); // Navigate to the homepage after logout
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Logout error: ", error.message);
      } else {
        console.log("Logout error: unknown error");
      }
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:translate-x-0'
        } md:w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-center h-20 border-b border-gray-200">
            <h1 className="text-xl font-bold text-indigo-600">PromptFlow</h1>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              <SidebarItem 
                icon={<Home size={20} />} 
                text="Canvas" 
                active={activeItem === 'Canvas'} 
                onClick={() => handleItemClick('Canvas')}
              />
              {/* Additional Sidebar items can go here */}
            </ul>
          </div>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200">
            <button 
             className="flex items-center w-full p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
             onClick={handleLogout}>
              <LogOut size={20} className="mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

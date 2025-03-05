import React from 'react';
import { Home, LogOut, Menu, X, BookDashed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth';

type SidebarProps = {
  activeTab: 'Canvas' | 'Templates';
  onTabChange: (tab: 'Canvas' | 'Templates') => void;
};

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

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Logout error: ", error.message);
      } else {
        console.log("Logout error: unknown error");
      }
    }
  };

  return (
    <div className="h-full bg-white shadow-lg">
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
              active={activeTab === 'Canvas'} 
              onClick={() => onTabChange('Canvas')}
            />
            <SidebarItem 
              icon={<BookDashed size={20} />} 
              text="Templates" 
              active={activeTab === 'Templates'} 
              onClick={() => onTabChange('Templates')}
            />
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
  );
};

export default Sidebar;
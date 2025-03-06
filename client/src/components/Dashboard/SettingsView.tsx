import React from 'react';
import { Settings, User } from 'lucide-react';
import GoogleAccountIntegration from '../../services/GoogleAccountIntegration';

const SettingsView: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <Settings className="w-6 h-6 text-indigo-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {[
              { name: 'Account', icon: User, current: true },
            ].map((item) => (
              <button
                key={item.name}
                className={`${
                  item.current
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full`}
              >
                <item.icon
                  className={`${
                    item.current ? 'text-indigo-600' : 'text-gray-400'
                  } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
                />
                <span className="truncate">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
            {/* Profile Section */}
            <div className="p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Account Settings</h3>
              <div className="mt-6 flex flex-col space-y-4">
                <GoogleAccountIntegration />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
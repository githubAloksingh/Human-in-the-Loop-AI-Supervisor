import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertCircle, 
  CheckCircle, 
  BookOpen, 
  Phone,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Sidebar: React.FC = () => {
  const { pendingRequests } = useApp();
  
  const navItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/dashboard'
    },
    {
      label: 'Pending Requests',
      icon: <AlertCircle className="w-5 h-5" />,
      path: '/pending-requests',
      badge: pendingRequests.length
    },
    {
      label: 'Resolved Requests',
      icon: <CheckCircle className="w-5 h-5" />,
      path: '/resolved-requests'
    },
    {
      label: 'Knowledge Base',
      icon: <BookOpen className="w-5 h-5" />,
      path: '/knowledge-base'
    },
    {
      label: 'Simulate Call',
      icon: <Phone className="w-5 h-5" />,
      path: '/simulate-call'
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-screen">
      <div className="p-4 flex items-center gap-2 border-b border-gray-200">
        <MessageSquare className="h-6 w-6 text-blue-600" />
        <h1 className="text-xl font-semibold">Frontdesk AI</h1>
      </div>
      
      <nav className="p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
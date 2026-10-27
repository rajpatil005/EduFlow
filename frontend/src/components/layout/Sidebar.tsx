import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react'; 

export interface SidebarLink {
  label: string;
  path: string;
}

interface SidebarProps {
  links: SidebarLink[];
  title: string;
  isOpen: boolean;      
  onClose: () => void; 
}

export const Sidebar = ({ links, title, isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose} 
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
             <h1 className="text-xl font-bold text-blue-700">EduFlow</h1>
             <span className="text-xs text-gray-500">({title})</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-800">
             ✕
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {links.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose} 
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-md text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};
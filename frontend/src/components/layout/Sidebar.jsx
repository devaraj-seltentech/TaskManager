import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const Sidebar = ({ collapsed, onToggle, mobileOpen = false, onMobileClose, onNavigate }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onNavigate?.();
    onMobileClose?.();
  };

  const navItems = [
    { to: '/board', icon: LayoutDashboard, label: 'Board' },
    { to: '/employees', icon: Users, label: 'Employees' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar flex flex-col transition-all duration-300 z-50
        ${
          mobileOpen
            ? 'translate-x-0'
            : 'sm:translate-x-0 -translate-x-full'
        }
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg  flex items-center justify-center flex-shrink-0">
          <img
            src="/Selten-icon.png"
            alt="Selten WorkFlow"
            className="w-10 h-10 object-contain"
          />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-sidebar-foreground">Selten WorkFlow</span>
        )}
        {/* Mobile close */}
        <button
          type="button"
          onClick={() => onMobileClose?.()}
          className="sm:hidden ml-auto w-9 h-9 rounded-lg flex items-center justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-foreground/10 transition-colors"
          aria-label="Close menu"
          title="Close"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2">
        <ul className="space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
                }
                onClick={() => onNavigate?.()}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User & Logout */}
      <div className="p-2 border-t border-sidebar-border">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {user.email}
            </p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 ${
            collapsed ? 'justify-center px-2' : ''
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="hidden sm:flex absolute -right-4 top-4 w-8 h-8 rounded-full bg-card border-2 border-border items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm"
      >
        {collapsed ? (
          <ChevronRight className="w-6 h-6" />
        ) : (
          <ChevronLeft className="w-6 h-6" />
        )}
      </button>
    </aside>
  );
};


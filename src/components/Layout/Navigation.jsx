import { NavLink } from 'react-router-dom';
import { Home, Building2, Calendar, Car, Info, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/helpers';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/baite', label: 'Baite', icon: Building2 },
  { to: '/calendario', label: 'Programma', icon: Calendar },
  { to: '/auto', label: 'Auto', icon: Car },
  { to: '/info', label: 'Info', icon: Info },
];

const Navigation = ({ mobile = false, onItemClick }) => {
  const { currentUser } = useApp();

  const baseClasses = mobile
    ? 'flex flex-col space-y-1'
    : 'flex items-center space-x-1';

  const linkClasses = (isActive) =>
    cn(
      'flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors',
      mobile ? 'w-full' : '',
      isActive
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    );

  return (
    <nav className={baseClasses}>
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onItemClick}
          className={({ isActive }) => linkClasses(isActive)}
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </NavLink>
      ))}
      {currentUser && mobile && (
        <NavLink
          to="/profilo"
          onClick={onItemClick}
          className={({ isActive }) => linkClasses(isActive)}
        >
          <User className="w-5 h-5" />
          <span>Profilo</span>
        </NavLink>
      )}
    </nav>
  );
};

export default Navigation;

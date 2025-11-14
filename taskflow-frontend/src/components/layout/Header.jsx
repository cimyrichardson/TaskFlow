import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckSquare, LogOut, User, BarChart3, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import logo from '../../assets/taskflow.png';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/home');
  };

  const navigation = [
    { name: 'Tableau de bord', href: '/', icon: CheckSquare },
    { name: 'Statistiques', href: '/statistics', icon: BarChart3 },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et navigation principale */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3">
              <img src={logo} alt="TaskFlow Logo" className="h-12 w-12" />
              <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
            </Link>
            
            {/* Navigation desktop */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === item.href
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Section utilisateur */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-gray-700">
              <User className="h-5 w-5" />
              <span className="font-medium">{user?.name}</span>
            </div>
            
            <Link to="/home">
              <Button variant="secondary" size="small">
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Button>
            </Link>
            
            <Button variant="secondary" size="small" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>

            {/* Menu mobile */}
            <button
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                      location.pathname === item.href
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="flex items-center px-3 py-2 text-gray-600">
                <User className="h-5 w-5 mr-3" />
                {user?.name}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
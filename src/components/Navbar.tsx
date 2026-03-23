import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Menu } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {!isHome && (
          <button className="hamburger" onClick={onToggleSidebar}>
            <Menu size={24} />
          </button>
        )}
        <Link to="/" className="logo">
          <Code2 size={32} />
          <span>CodePath AI</span>
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Home
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

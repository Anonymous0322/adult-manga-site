import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Главная', icon: 'fa-home' },
    { path: '/catalog', label: 'Каталог', icon: 'fa-book' },
    { path: '/forum', label: 'Форум', icon: 'fa-comments' },
    { path: '/trending', label: 'Популярное', icon: 'fa-fire' },
    { path: '/new', label: 'Новинки', icon: 'fa-star' }
  ];

  return (
    <nav className="navbar">
      <ul className="nav-list">
        {navItems.map(item => (
          <li key={item.path} className="nav-item">
            <Link 
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <i className={`fas ${item.icon}`}></i>
              <span className="nav-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
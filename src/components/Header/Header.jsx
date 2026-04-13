import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import CatalogDropdown from '../Dropdown/CatalogDropdown';
import { useLanguage } from '../../context/LanguageContext';
import './Header.css';

const Header = () => {
  const { t } = useLanguage();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const catalogRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (catalogRef.current && !catalogRef.current.contains(event.target)) {
        setIsCatalogOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="MangaUz" />
            <span className="logo-text">MangaUz</span>
          </Link>
        </div>

        <nav className={`nav-section ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="catalog-link" ref={catalogRef}>
            <button className="catalog-btn" onClick={() => setIsCatalogOpen((p) => !p)}>
              <i className="fas fa-bars"></i> {t('catalog')}
            </button>
            {isCatalogOpen && (
              <div className="catalog-dropdown-wrapper">
                <CatalogDropdown />
              </div>
            )}
          </div>

          <Link to="/forum" className="nav-link">
            <i className="fas fa-comments"></i> {t('forum')}
          </Link>

          <div className="search-container">
            <SearchBar />
          </div>
        </nav>

        <div className="user-section">
          <UserMenu />
        </div>

        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen((p) => !p)} aria-label="Toggle menu">
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
    </header>
  );
};

export default Header;

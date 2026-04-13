import React from 'react';
import { Link } from 'react-router-dom';
import './CatalogDropdown.css';

const catalogItems = [
  { title: 'Users', route: '/catalog/users', icon: 'fa-users' },
  { title: 'Characters', route: '/catalog/characters', icon: 'fa-user-friends' },
  { title: 'Titles', route: '/catalog/titles', icon: 'fa-star' },
  { title: 'Reading Now', route: '/catalog/reading-now', icon: 'fa-eye' },
  { title: 'Collections', route: '/catalog/collections', icon: 'fa-folder' },
  { title: 'Reviews', route: '/catalog/reviews', icon: 'fa-comment-alt' }
];

const categories = [
  { id: 'manga', title: 'Manga', icon: 'fa-book', color: '#ff6b6b' },
  { id: 'manhwa', title: 'Manhwa', icon: 'fa-flag', color: '#45b7d1' },
  { id: 'manhua', title: 'Manhua', icon: 'fa-paint-brush', color: '#96ceb4' },
  { id: 'video', title: 'Video', icon: 'fa-video', color: '#a55eea' }
];

const CatalogDropdown = () => {
  return (
    <div className="catalog-dropdown">
      <div className="dropdown-container">
        <div className="left-section">
          <h3 className="dropdown-title">Catalog</h3>
          <ul className="catalog-list">
            {catalogItems.map((item) => (
              <li key={item.route} className="catalog-item">
                <Link to={item.route} className="catalog-link">
                  <i className={`fas ${item.icon}`}></i>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="right-section">
          <h3 className="dropdown-title">Categories</h3>
          <div className="categories-grid">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                title={category.title}
                icon={category.icon}
                color={category.color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryCard = ({ id, title, icon, color }) => (
  <Link to={`/catalog/${id}`} className="category-card">
    <div className="category-icon" style={{ backgroundColor: color }}>
      <i className={`fas ${icon}`}></i>
    </div>
    <span className="category-title">{title}</span>
  </Link>
);

export default CatalogDropdown;

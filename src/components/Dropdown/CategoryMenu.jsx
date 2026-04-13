import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryMenu.css';

const CategoryMenu = () => {
  const categories = [
    { id: 'manga', title: 'Манга', icon: 'fa-book', color: '#ff6b6b' },
    { id: 'oel-manga', title: 'OEL-манга', icon: 'fa-globe', color: '#4ecdc4' },
    { id: 'manhwa', title: 'Манхва', icon: 'fa-flag', color: '#45b7d1' },
    { id: 'manhua', title: 'Маньхуа', icon: 'fa-paint-brush', color: '#96ceb4' },
    { id: 'ru-manga', title: 'Руманга', icon: 'fa-map-marker', color: '#ffa726' },
    { id: 'comics', title: 'Комикс', icon: 'fa-user', color: '#fc5c65' },
    { id: 'video', title: 'Видео', icon: 'fa-video', color: '#a55eea' }
  ];

  return (
    <div className="category-menu">
      <div className="menu-header">
        <h3>Категории</h3>
        <Link to="/catalog" className="view-all">
          Все категории →
        </Link>
      </div>
      
      <div className="categories-grid">
        {categories.map(category => (
          <Link 
            key={category.id} 
            to={`/catalog/${category.id}`}
            className="category-item"
          >
            <div className="category-icon" style={{ backgroundColor: category.color }}>
              <i className={`fas ${category.icon}`}></i>
            </div>
            <span className="category-title">{category.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
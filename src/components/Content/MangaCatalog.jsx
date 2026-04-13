import React, { useState } from 'react';
import MangaCard from './MangaCard';
import './MangaCatalog.css';

const MangaCatalog = () => {
  const [mangaList] = useState([
    {
      id: 1,
      title: 'Berserk',
      type: 'Манга',
      author: 'Kentaro Miura',
      cover: 'https://placehold.co/400x600/ff6b6b/white?text=Berserk',
      rating: 4.9,
      chapters: 363,
      views: 1250000,
      status: 'Продолжается'
    },
    {
      id: 2,
      title: 'Solo Leveling',
      type: 'Манхва',
      author: 'Chugong',
      cover: 'https://placehold.co/400x600/4ecdc4/white?text=Solo+Leveling',
      rating: 4.8,
      chapters: 179,
      views: 980000,
      status: 'Завершено'
    },
    {
      id: 3,
      title: 'Tower of God',
      type: 'Манхва',
      author: 'SIU',
      cover: 'https://placehold.co/400x600/45b7d1/white?text=Tower+of+God',
      rating: 4.7,
      chapters: 560,
      views: 850000,
      status: 'Продолжается'
    },
    {
      id: 4,
      title: 'One Piece',
      type: 'Манга',
      author: 'Eiichiro Oda',
      cover: 'https://placehold.co/400x600/96ceb4/white?text=One+Piece',
      rating: 4.9,
      chapters: 1085,
      views: 1500000,
      status: 'Продолжается'
    },
    {
      id: 5,
      title: 'Attack on Titan',
      type: 'Манга',
      author: 'Hajime Isayama',
      cover: 'https://placehold.co/400x600/ffa726/white?text=Attack+on+Titan',
      rating: 4.8,
      chapters: 139,
      views: 1200000,
      status: 'Завершено'
    },
    {
      id: 6,
      title: 'Naruto',
      type: 'Манга',
      author: 'Masashi Kishimoto',
      cover: 'https://placehold.co/400x600/a55eea/white?text=Naruto',
      rating: 4.7,
      chapters: 700,
      views: 1100000,
      status: 'Завершено'
    },
    {
      id: 7,
      title: 'Demon Slayer',
      type: 'Манга',
      author: 'Koyoharu Gotouge',
      cover: 'https://placehold.co/400x600/fc5c65/white?text=Demon+Slayer',
      rating: 4.6,
      chapters: 205,
      views: 950000,
      status: 'Завершено'
    },
    {
      id: 8,
      title: 'Jujutsu Kaisen',
      type: 'Манга',
      author: 'Gege Akutami',
      cover: 'https://placehold.co/400x600/26de81/white?text=Jujutsu+Kaisen',
      rating: 4.7,
      chapters: 236,
      views: 850000,
      status: 'Продолжается'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const filteredManga = mangaList.filter(manga => {
    if (filter === 'all') return true;
    if (filter === 'ongoing') return manga.status === 'Продолжается';
    if (filter === 'completed') return manga.status === 'Завершено';
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.views - a.views;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      case 'chapters':
        return b.chapters - a.chapters;
      default:
        return b.views - a.views;
    }
  });

  return (
    <div className="manga-catalog">
      <div className="catalog-header">
        <h2>Каталог манги и манхвы</h2>
        
        <div className="catalog-controls">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Все
            </button>
            <button 
              className={`filter-btn ${filter === 'ongoing' ? 'active' : ''}`}
              onClick={() => setFilter('ongoing')}
            >
              Продолжается
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Завершено
            </button>
          </div>
          
          <div className="sort-controls">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="popular">По популярности</option>
              <option value="rating">По рейтингу</option>
              <option value="newest">Сначала новые</option>
              <option value="chapters">По количеству глав</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="manga-grid">
        {filteredManga.map(manga => (
          <MangaCard key={manga.id} manga={manga} />
        ))}
      </div>
      
      <div className="catalog-pagination">
        <button className="pagination-btn">
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="pagination-btn active">1</button>
        <button className="pagination-btn">2</button>
        <button className="pagination-btn">3</button>
        <button className="pagination-btn">4</button>
        <button className="pagination-btn">5</button>
        <button className="pagination-btn">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default MangaCatalog;
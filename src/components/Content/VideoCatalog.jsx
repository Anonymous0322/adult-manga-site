import React, { useState } from 'react';
import './VideoCatalog.css';

const VideoCatalog = () => {
  const [videos] = useState([
    {
      id: 1,
      title: 'Лучшие сцены из аниме 2023',
      thumbnail: 'https://placehold.co/400x225/ff6b6b/white?text=Аниме+2023',
      duration: '15:32',
      views: '245K',
      author: 'AnimeCompilation',
      uploadDate: '2 дня назад',
      category: 'Обзоры',
      rating: 4.8
    },
    {
      id: 2,
      title: 'Обзор манги: Solo Leveling',
      thumbnail: 'https://placehold.co/400x225/4ecdc4/white?text=Solo+Leveling',
      duration: '22:18',
      views: '189K',
      author: 'MangaReviewer',
      uploadDate: '5 дней назад',
      category: 'Обзоры',
      rating: 4.9
    },
    {
      id: 3,
      title: 'Топ 10 моментов из Berserk',
      thumbnail: 'https://placehold.co/400x225/45b7d1/white?text=Berserk+Top10',
      duration: '18:45',
      views: '312K',
      author: 'BerserkFan',
      uploadDate: '1 неделю назад',
      category: 'Топы',
      rating: 4.7
    },
    {
      id: 4,
      title: 'AMV - Лучшие битвы в аниме',
      thumbnail: 'https://placehold.co/400x225/96ceb4/white?text=AMV+Battles',
      duration: '12:30',
      views: '421K',
      author: 'AMVCreator',
      uploadDate: '3 дня назад',
      category: 'AMV',
      rating: 4.9
    },
    {
      id: 5,
      title: 'История манги: One Piece',
      thumbnail: 'https://placehold.co/400x225/ffa726/white?text=One+Piece+History',
      duration: '25:10',
      views: '156K',
      author: 'MangaHistorian',
      uploadDate: '1 неделю назад',
      category: 'Документальные',
      rating: 4.6
    },
    {
      id: 6,
      title: 'Обзор аниме сезона',
      thumbnail: 'https://placehold.co/400x225/a55eea/white?text=Anime+Season',
      duration: '19:45',
      views: '278K',
      author: 'AnimeCritic',
      uploadDate: '4 дня назад',
      category: 'Обзоры',
      rating: 4.5
    },
    {
      id: 7,
      title: 'Создание манги: процесс',
      thumbnail: 'https://placehold.co/400x225/fc5c65/white?text=Manga+Creation',
      duration: '14:20',
      views: '89K',
      author: 'MangaArtist',
      uploadDate: '2 недели назад',
      category: 'Образовательные',
      rating: 4.8
    },
    {
      id: 8,
      title: 'Интервью с мангакой',
      thumbnail: 'https://placehold.co/400x225/26de81/white?text=Mangaka+Interview',
      duration: '32:15',
      views: '112K',
      author: 'MangaInterviews',
      uploadDate: '1 неделю назад',
      category: 'Интервью',
      rating: 4.7
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = ['Все', 'Обзоры', 'Топы', 'AMV', 'Документальные', 'Образовательные', 'Интервью'];

  const filteredVideos = videos.filter(video => 
    filter === 'all' || video.category === filter
  ).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.uploadDate) - new Date(a.uploadDate);
      case 'rating':
        return b.rating - a.rating;
      case 'views':
        return parseInt(b.views) - parseInt(a.views);
      default: // popular
        return parseInt(b.views) - parseInt(a.views);
    }
  });

  return (
    <div className="video-catalog">
      <div className="catalog-header">
        <h2>Видео каталог</h2>
        
        <div className="catalog-controls">
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-filter ${filter === (category === 'Все' ? 'all' : category) ? 'active' : ''}`}
                onClick={() => setFilter(category === 'Все' ? 'all' : category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="sort-controls">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="popular">По популярности</option>
              <option value="newest">Сначала новые</option>
              <option value="rating">По рейтингу</option>
              <option value="views">По просмотрам</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="videos-grid">
        {filteredVideos.map(video => (
          <div key={video.id} className="video-catalog-card">
            <div className="video-thumbnail">
              <img src={video.thumbnail} alt={video.title} />
              <div className="video-duration">{video.duration}</div>
              <div className="video-overlay">
                <i className="fas fa-play"></i>
              </div>
            </div>
            
            <div className="video-content">
              <h3 className="video-title">{video.title}</h3>
              
              <div className="video-meta">
                <span className="video-category">{video.category}</span>
                <span className="video-rating">
                  <i className="fas fa-star"></i>
                  {video.rating}
                </span>
              </div>
              
              <div className="video-info">
                <span className="video-author">
                  <i className="fas fa-user"></i>
                  {video.author}
                </span>
                <span className="video-views">
                  <i className="fas fa-eye"></i>
                  {video.views}
                </span>
              </div>
              
              <div className="video-date">
                <i className="fas fa-clock"></i>
                {video.uploadDate}
              </div>
              
              <button className="watch-btn">
                <i className="fas fa-play"></i>
                Смотреть
              </button>
            </div>
          </div>
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

export default VideoCatalog;
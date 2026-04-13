import React from 'react';
import { Link } from 'react-router-dom';
import './MangaCard.css';

const formatNumber = (num = 0) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(num);
};

const MangaCard = ({ manga }) => {
  const isVideo = manga.contentType === 'video' || String(manga.type || '').toLowerCase() === 'video';
  const chapterCount = Array.isArray(manga.chapters) ? manga.chapters.length : Number(manga.chapters || 0);

  return (
    <Link to={`/content/${manga.id}`} className="manga-card">
      <div className="card-image">
        {manga.cover ? <img src={manga.cover} alt={manga.title} /> : <div className="no-cover">No cover</div>}
        <div className="image-overlay">
          <div className="overlay-content">
            <i className="fas fa-play"></i>
            <span>{isVideo ? 'Watch' : 'Read'}</span>
          </div>
        </div>
        <div className="card-badge">{manga.type || manga.category}</div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{manga.title}</h3>
        <p className="card-author">{manga.author}</p>

        <div className="card-stats">
          <div className="stat">
            <i className="fas fa-star"></i>
            <span>{manga.rating || 0}</span>
          </div>
          <div className="stat">
            <i className={`fas ${isVideo ? 'fa-video' : 'fa-book'}`}></i>
            <span>{isVideo ? 'Video' : `${chapterCount} ch.`}</span>
          </div>
          <div className="stat">
            <i className="fas fa-eye"></i>
            <span>{formatNumber(manga.views || 0)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MangaCard;

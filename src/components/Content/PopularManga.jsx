import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentService } from '../../services/contentService';
import MangaCard from './MangaCard';
import './PopularManga.css';

const PopularManga = () => {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await contentService.getPopularContent();
      const filtered =
        activeTab === 'all' ? data : data.filter((item) => item.category === activeTab);
      setPopular(filtered);
      setLoading(false);
    };
    load();
  }, [activeTab]);

  const tabs = [
    { id: 'all', label: 'All', icon: 'fa-fire' },
    { id: 'manga', label: 'Manga', icon: 'fa-book' },
    { id: 'manhwa', label: 'Manhwa', icon: 'fa-flag' }
  ];

  return (
    <div className="popular-manga">
      <div className="tabs">
        {tabs.map((tab) => (
          <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            <i className={`fas ${tab.icon}`}></i> {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-grid">{[1, 2, 3, 4].map((i) => <div key={i} className="skeleton-card"></div>)}</div>
      ) : (
        <div className="manga-grid">{popular.map((item) => <MangaCard key={item.id} manga={item} />)}</div>
      )}

      <div className="view-more">
        <Link to="/catalog/titles" className="view-more-btn">
          View more <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};

export default PopularManga;

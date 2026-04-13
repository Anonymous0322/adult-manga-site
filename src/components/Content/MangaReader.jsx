import React, { useState } from 'react';
import './MangaReader.css';

const MangaReader = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [settings, setSettings] = useState({
    zoom: 100,
    readingMode: 'vertical',
    quality: 'high'
  });

  const totalPages = 45;
  const pages = Array.from({ length: 10 }, (_, i) => 
    `https://placehold.co/800x1200/4ecdc4/white?text=Страница+${currentPage + i}`
  );

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleZoomIn = () => {
    setSettings(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom + 25, 300)
    }));
  };

  const handleZoomOut = () => {
    setSettings(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom - 25, 50)
    }));
  };

  const toggleReadingMode = () => {
    setSettings(prev => ({
      ...prev,
      readingMode: prev.readingMode === 'vertical' ? 'horizontal' : 'vertical'
    }));
  };

  return (
    <div className="manga-reader">
      <div className="reader-header">
        <div className="reader-info">
          <h3>Berserk - Глава 363</h3>
          <div className="page-info">
            Страница {currentPage} из {totalPages}
          </div>
        </div>
        
        <div className="reader-controls">
          <button className="control-btn" onClick={handlePrevPage} disabled={currentPage === 1}>
            <i className="fas fa-chevron-left"></i>
            Предыдущая
          </button>
          
          <div className="zoom-controls">
            <button className="zoom-btn" onClick={handleZoomOut}>
              <i className="fas fa-search-minus"></i>
            </button>
            <span className="zoom-level">{settings.zoom}%</span>
            <button className="zoom-btn" onClick={handleZoomIn}>
              <i className="fas fa-search-plus"></i>
            </button>
          </div>
          
          <button className="control-btn" onClick={toggleReadingMode}>
            <i className={`fas fa-${settings.readingMode === 'vertical' ? 'arrows-alt-v' : 'arrows-alt-h'}`}></i>
            {settings.readingMode === 'vertical' ? 'Вертикально' : 'Горизонтально'}
          </button>
          
          <button className="control-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
            Следующая
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      
      <div className="reader-content" style={{ zoom: `${settings.zoom}%` }}>
        {settings.readingMode === 'vertical' ? (
          <div className="vertical-reader">
            {pages.map((page, index) => (
              <div key={index} className="page-container">
                <img src={page} alt={`Страница ${currentPage + index}`} />
              </div>
            ))}
          </div>
        ) : (
          <div className="horizontal-reader">
            {pages.map((page, index) => (
              <img key={index} src={page} alt={`Страница ${currentPage + index}`} />
            ))}
          </div>
        )}
      </div>
      
      <div className="reader-footer">
        <div className="page-navigation">
          <input
            type="range"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => setCurrentPage(parseInt(e.target.value))}
            className="page-slider"
          />
        </div>
        
        <div className="quick-settings">
          <div className="setting">
            <span>Качество:</span>
            <select 
              value={settings.quality}
              onChange={(e) => setSettings({...settings, quality: e.target.value})}
            >
              <option value="low">Низкое</option>
              <option value="medium">Среднее</option>
              <option value="high">Высокое</option>
            </select>
          </div>
          
          <button className="fullscreen-btn">
            <i className="fas fa-expand"></i>
            Полный экран
          </button>
        </div>
      </div>
    </div>
  );
};

export default MangaReader;
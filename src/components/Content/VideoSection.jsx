import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getVideoContent } from '../../utils/contentStore';
import './VideoSection.css';

const VideoSection = () => {
  const videos = useMemo(() => getVideoContent().slice(0, 6), []);

  return (
    <div className="video-section">
      <div className="videos-grid">
        {videos.map((video) => (
          <article key={video.id} className="video-card">
            <div className="video-thumbnail">
              <img src={video.cover} alt={video.title} />
              <div className="play-button"><i className="fas fa-play"></i></div>
            </div>

            <div className="video-info">
              <h3 className="video-title">{video.title}</h3>
              <div className="video-meta">
                <span className="video-author"><i className="fas fa-user"></i>{video.author}</span>
                <span className="video-views"><i className="fas fa-eye"></i>{Number(video.views || 0).toLocaleString()}</span>
              </div>
              <Link className="watch-later" to={`/content/${video.id}`}>Open</Link>
            </div>
          </article>
        ))}
      </div>

      <div className="video-controls">
        <Link className="load-more-btn" to="/catalog/video">
          <i className="fas fa-video"></i> Browse videos
        </Link>
      </div>
    </div>
  );
};

export default VideoSection;

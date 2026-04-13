import React from 'react';
import PopularManga from '../components/Content/PopularManga';
import TopUsers from '../components/Sidebar/TopUsers';
import VideoSection from '../components/Content/VideoSection';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="main-section">
        <h1 className="welcome-title">Welcome to MangaUz</h1>
        <p className="welcome-subtitle">Read manga/manhwa and watch curated videos in one place.</p>

        <section className="popular-section">
          <h2 className="section-title"><i className="fas fa-fire"></i> Popular Manga</h2>
          <PopularManga />
        </section>

        <section className="video-section">
          <h2 className="section-title"><i className="fas fa-video"></i> Popular Videos</h2>
          <VideoSection />
        </section>
      </div>

      <div className="sidebar-section">
        <TopUsers />
      </div>
    </div>
  );
};

export default HomePage;

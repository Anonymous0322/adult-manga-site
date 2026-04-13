import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMangaContent } from '../utils/contentStore';
import './LibraryPage.css';

const LibraryPage = () => {
  const { user } = useAuth();
  const items = useMemo(() => getMangaContent().slice(0, 8), []);

  if (!user) {
    return (
      <div className="library-page">
        <h2>Login required</h2>
        <p>You need to sign in to view your library.</p>
      </div>
    );
  }

  return (
    <div className="library-page">
      <div className="library-header">
        <h1>My Library</h1>
        <p>Your saved and active reading list.</p>
      </div>
      <div className="library-grid">
        {items.map((item) => (
          <div key={item.id} className="library-card">
            <img src={item.cover} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.author}</p>
            <div className="library-actions">
              <Link to={`/content/${item.id}`} className="open-btn">Open</Link>
              {item.chapters?.length > 0 && <Link to={`/read/${item.id}/${item.chapters[0].number}`} className="open-btn">Read now</Link>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryPage;

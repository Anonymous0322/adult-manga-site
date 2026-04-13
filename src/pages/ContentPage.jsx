import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getContentById } from '../utils/contentStore';
import './ContentPage.css';

const ContentPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('chapters');
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const content = useMemo(() => getContentById(id), [id]);

  if (!content) {
    return (
      <div className="content-page not-found">
        <h2>Content not found</h2>
        <p>The selected content does not exist.</p>
      </div>
    );
  }

  const chapters = Array.isArray(content.chapters) ? content.chapters : [];

  const getFileExt = (src) => {
    if (typeof src !== 'string') return 'bin';
    if (src.startsWith('data:application/pdf')) return 'pdf';
    if (src.startsWith('data:image/png')) return 'png';
    if (src.startsWith('data:image/webp')) return 'webp';
    if (src.startsWith('data:image/jpeg') || src.startsWith('data:image/jpg')) return 'jpg';
    return 'jpg';
  };

  const downloadChapter = (chapter) => {
    const pages = chapter?.pages || [];
    if (!pages.length) return;
    pages.forEach((page, index) => {
      const link = document.createElement('a');
      link.href = page;
      const ext = getFileExt(page);
      link.download = `${content.title.replace(/\s+/g, '_')}_ch${chapter.number}_p${index + 1}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setReviews((prev) => [
      {
        id: Date.now(),
        user: 'You',
        rating: Number(reviewRating),
        text: reviewText.trim()
      },
      ...prev
    ]);
    setReviewText('');
    setReviewRating(5);
  };

  return (
    <div className="content-page">
      <div className="content-header">
        <div className="cover-container">
          <img src={content.cover} alt={content.title} className="cover-image" />
        </div>

        <div className="content-info">
          <div className="content-header-row">
            <h1 className="content-title">{content.title}</h1>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {content.contentType === 'manga' && chapters.length > 0 && (
                <Link to={`/read/${content.id}/${chapters[0].number}`} className="favorite-btn">
                  <i className="fas fa-book-open"></i>
                  Read now
                </Link>
              )}
              {content.contentType === 'manga' && chapters.length > 0 && (
                <button className="favorite-btn" onClick={() => downloadChapter(chapters[0])}>
                  <i className="fas fa-download"></i>
                  Download
                </button>
              )}
            </div>
          </div>

          <div className="content-meta">
            <span className="meta-item">
              <i className="fas fa-user"></i>
              {content.author}
            </span>
            <span className="meta-item">
              <i className="fas fa-eye"></i>
              {Number(content.views || 0).toLocaleString()} views
            </span>
            <span className="meta-item">
              <i className="fas fa-tag"></i>
              {content.category}
            </span>
          </div>

          <div className="content-rating">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`fas fa-star ${i < Math.floor(content.rating || 0) ? 'filled' : ''}`}
                ></i>
              ))}
            </div>
            <span className="rating-value">{content.rating || 0}/5</span>
          </div>

          <div className="content-genres">
            {(content.tags || []).map((tag) => (
              <span key={tag} className="genre-tag">
                {tag}
              </span>
            ))}
          </div>

          <p className="content-description">{content.description}</p>
        </div>
      </div>

      <div className="content-tabs">
        <div className="tabs-nav">
          <button className={`tab-btn ${activeTab === 'chapters' ? 'active' : ''}`} onClick={() => setActiveTab('chapters')}>
            <i className="fas fa-list"></i> Chapters
          </button>
          <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
            <i className="fas fa-star"></i> Reviews
          </button>
          <button className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
            <i className="fas fa-info-circle"></i> Info
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'chapters' && (
            <div className="chapters-list">
              <div className="chapters-header">
                <h3>Chapters ({chapters.length})</h3>
              </div>
              {chapters.length > 0 ? (
                <div className="chapters-grid">
                  {chapters
                    .slice()
                    .sort((a, b) => b.number - a.number)
                    .map((chapter) => (
                      <div key={chapter.id || chapter.number} className="chapter-card">
                        <div className="chapter-info">
                          <span className="chapter-number">Chapter {chapter.number}</span>
                          <span className="chapter-title">{chapter.title}</span>
                          <span className="chapter-date">{(chapter.pages || []).length} pages</span>
                        </div>
                        <div className="chapter-actions">
                          <Link to={`/read/${content.id}/${chapter.number}`} className="read-btn">
                            <i className="fas fa-book-open"></i>
                            Read
                          </Link>
                          <button className="read-btn" onClick={() => downloadChapter(chapter)}>
                            <i className="fas fa-download"></i>
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p>No chapters yet.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-section">
              <h3>User Reviews</h3>
              <form className="review-form" onSubmit={handleAddReview}>
                <select value={reviewRating} onChange={(e) => setReviewRating(e.target.value)}>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} stars
                    </option>
                  ))}
                </select>
                <input
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write review..."
                />
                <button type="submit" className="action-btn primary">Post</button>
              </form>

              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="chapter-card">
                    <div className="chapter-info">
                      <strong>{review.user}</strong>
                      <span>{'★'.repeat(review.rating)}</span>
                      <span>{review.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="info-section">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Type:</span>
                  <span className="info-value">{content.contentType}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Category:</span>
                  <span className="info-value">{content.category}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className="info-value">{content.status}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tags:</span>
                  <span className="info-value">{(content.tags || []).join(', ') || '-'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentPage;

import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getContentById } from '../utils/contentStore';
import './ReadPage.css';

const ReadPage = () => {
  const { contentId, chapterNumber } = useParams();
  const [zoom, setZoom] = useState(100);
  const content = useMemo(() => getContentById(contentId), [contentId]);

  const chapters = content?.chapters || [];
  const chapter = useMemo(
    () => chapters.find((item) => Number(item.number) === Number(chapterNumber)) || chapters[0],
    [chapters, chapterNumber]
  );

  if (!content || !chapter) {
    return (
      <div className="read-page">
        <h2>Reader not available</h2>
      </div>
    );
  }

  const isPdfSource = (src) => typeof src === 'string' && src.startsWith('data:application/pdf');

  return (
    <div className="read-page">
      <div className="reader-top">
        <div>
          <h1>{content.title}</h1>
          <p>Chapter {chapter.number}: {chapter.title}</p>
        </div>
        <div className="reader-actions">
          <button onClick={() => setZoom((z) => Math.max(60, z - 10))}>-</button>
          <span>{zoom}%</span>
          <button onClick={() => setZoom((z) => Math.min(180, z + 10))}>+</button>
          <Link to={`/content/${content.id}`} className="back-btn">Back</Link>
        </div>
      </div>

      <div className="chapter-switcher">
        {chapters.map((item) => (
          <Link
            key={item.number}
            className={`chapter-chip ${Number(item.number) === Number(chapter.number) ? 'active' : ''}`}
            to={`/read/${content.id}/${item.number}`}
          >
            Ch {item.number}
          </Link>
        ))}
      </div>

      <div className="reader-pages" style={{ '--zoom-factor': zoom / 100 }}>
        {(chapter.pages || []).map((pageUrl, index) => (
          isPdfSource(pageUrl) ? (
            <iframe
              key={index}
              src={pageUrl}
              title={`PDF ${index + 1}`}
              style={{ width: '100%', height: '80vh', border: '0', borderRadius: '10px' }}
            />
          ) : (
            <img key={index} src={pageUrl} alt={`Page ${index + 1}`} />
          )
        ))}
      </div>
    </div>
  );
};

export default ReadPage;

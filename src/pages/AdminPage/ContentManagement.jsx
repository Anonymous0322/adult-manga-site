import React, { useMemo, useState } from 'react';
import { addChapterToContent, deleteContentItem, getAllContent } from '../../utils/contentStore';

const ContentManagement = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [chapterDrafts, setChapterDrafts] = useState({});
  const items = useMemo(() => getAllContent(), [refreshKey]);

  const onDelete = (id) => {
    deleteContentItem(id);
    setRefreshKey((k) => k + 1);
  };

  const updateDraft = (id, patch) => {
    setChapterDrafts((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || { title: '', pages: '' }), ...patch }
    }));
  };

  const addChapter = (id) => {
    const draft = chapterDrafts[id];
    if (!draft?.pages?.trim()) return;
    addChapterToContent(id, {
      title: draft.title || 'New chapter',
      pages: draft.pages.split('\n').map((x) => x.trim()).filter(Boolean)
    });
    setChapterDrafts((prev) => ({ ...prev, [id]: { title: '', pages: '' } }));
    setRefreshKey((k) => k + 1);
  };

  return (
    <div>
      <h2>Content Management</h2>
      <div className="admin-card">
        {items.map((item) => (
          <div key={item.id} className="admin-row" style={{ alignItems: 'flex-start', flexDirection: 'column' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <strong>{item.title}</strong>
                <div>Type: {item.contentType} • Category: {item.category}</div>
                <div>Chapters: {Array.isArray(item.chapters) ? item.chapters.length : 0}</div>
              </div>
              <button className="small-btn danger" onClick={() => onDelete(item.id)}>Delete</button>
            </div>

            {item.contentType === 'manga' && (
              <div style={{ width: '100%', marginTop: '0.65rem' }}>
                <input
                  value={chapterDrafts[item.id]?.title || ''}
                  onChange={(e) => updateDraft(item.id, { title: e.target.value })}
                  placeholder="Chapter title"
                  style={{ width: '100%', marginBottom: '0.45rem' }}
                />
                <textarea
                  rows={3}
                  value={chapterDrafts[item.id]?.pages || ''}
                  onChange={(e) => updateDraft(item.id, { pages: e.target.value })}
                  placeholder={'Page URLs (new line)\nhttps://.../1.jpg\nhttps://.../2.jpg'}
                  style={{ width: '100%', marginBottom: '0.45rem' }}
                />
                <button className="small-btn" onClick={() => addChapter(item.id)}>Add chapter</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentManagement;

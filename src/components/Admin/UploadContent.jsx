import React, { useState } from 'react';
import { addContentItem } from '../../utils/contentStore';
import './UploadContent.css';

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const emptyChapter = (number = 1) => ({ number, title: `Chapter ${number}`, pageFiles: [] });

const UploadContent = () => {
  const [contentType, setContentType] = useState('manga');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: 'manga',
    tags: '',
    cover: '',
    videoUrl: '',
    chapters: [emptyChapter(1)]
  });

  const categoriesByType = {
    manga: [
      { value: 'manga', label: 'Manga' },
      { value: 'manhwa', label: 'Manhwa' },
      { value: 'manhua', label: 'Manhua' }
    ],
    video: [
      { value: 'amv', label: 'AMV' },
      { value: 'review', label: 'Review' },
      { value: 'trailer', label: 'Trailer' }
    ]
  };

  const updateField = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));

  const handleCover = async (file) => {
    if (!file) return;
    const base64 = await toBase64(file);
    updateField('cover', base64);
  };

  const updateChapter = (index, patch) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((chapter, i) => (i === index ? { ...chapter, ...patch } : chapter))
    }));
  };

  const addChapterRow = () => {
    setFormData((prev) => ({
      ...prev,
      chapters: [...prev.chapters, emptyChapter(prev.chapters.length + 1)]
    }));
  };

  const removeChapterRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== index).map((ch, i) => ({ ...ch, number: i + 1 }))
    }));
  };

  const handleChapterFiles = (index, files) => {
    updateChapter(index, { pageFiles: files ? Array.from(files) : [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');
    try {
      const isManga = contentType === 'manga';
      const tags = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);

      if (isManga) {
        const totalBytes = formData.chapters.reduce((sum, chapter) => {
          const chapterSize = (chapter.pageFiles || []).reduce((acc, file) => acc + (file?.size || 0), 0);
          return sum + chapterSize;
        }, 0);

        // localStorage is small (~5MB in most browsers). Base64 grows file size.
        const MAX_SAFE_BYTES = 3 * 1024 * 1024;
        if (totalBytes > MAX_SAFE_BYTES) {
          throw new Error('FILE_TOO_LARGE_FOR_LOCALSTORAGE');
        }
      }

      const chapters = isManga
        ? await Promise.all(
            formData.chapters.map(async (chapter) => {
              const pages = await Promise.all((chapter.pageFiles || []).map((file) => toBase64(file)));
              return {
                number: chapter.number,
                title: chapter.title || `Chapter ${chapter.number}`,
                pages
              };
            })
          )
        : [];

      addContentItem({
        title: formData.title,
        author: formData.author,
        description: formData.description,
        contentType,
        category: formData.category,
        tags,
        cover: formData.cover || '',
        views: 0,
        rating: 0,
        status: 'published',
        chapters,
        videoUrl: isManga ? '' : formData.videoUrl
      });

      setMessage('Content uploaded successfully.');
      setFormData({
        title: '',
        author: '',
        description: '',
        category: isManga ? 'manga' : 'amv',
        tags: '',
        cover: '',
        videoUrl: '',
        chapters: [emptyChapter(1)]
      });
    } catch (error) {
      if (error?.message === 'FILE_TOO_LARGE_FOR_LOCALSTORAGE') {
        setMessage('Upload failed: PDF/file is too large for browser local storage. Use smaller file or move storage to backend/IndexedDB.');
      } else if (error?.name === 'QuotaExceededError') {
        setMessage('Upload failed: browser storage quota exceeded (localStorage full).');
      } else {
        setMessage('Upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-content">
      <h2>Content Upload</h2>

      <div className="content-type-tabs">
        <button className={`type-tab ${contentType === 'manga' ? 'active' : ''}`} onClick={() => { setContentType('manga'); updateField('category', 'manga'); }}>
          <i className="fas fa-book"></i> Manga / Manhwa
        </button>
        <button className={`type-tab ${contentType === 'video' ? 'active' : ''}`} onClick={() => { setContentType('video'); updateField('category', 'amv'); }}>
          <i className="fas fa-video"></i> Video
        </button>
      </div>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-row">
          <div className="form-group">
            <label>Title *</label>
            <input value={formData.title} onChange={(e) => updateField('title', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Author *</label>
            <input value={formData.author} onChange={(e) => updateField('author', e.target.value)} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            <select value={formData.category} onChange={(e) => updateField('category', e.target.value)} required>
              {categoriesByType[contentType].map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tags</label>
            <input value={formData.tags} onChange={(e) => updateField('tags', e.target.value)} placeholder="action, drama, fantasy" />
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea value={formData.description} onChange={(e) => updateField('description', e.target.value)} rows="3" required />
        </div>

        <div className="form-group">
          <label>Cover image</label>
          <input type="file" accept="image/*" onChange={(e) => handleCover(e.target.files?.[0])} />
        </div>

        {contentType === 'video' && (
          <div className="form-group">
            <label>Video URL *</label>
            <input value={formData.videoUrl} onChange={(e) => updateField('videoUrl', e.target.value)} placeholder="https://..." required />
          </div>
        )}

        {contentType === 'manga' && (
          <div className="chapters-section">
            <div className="chapters-header">
              <h3>Chapters</h3>
              <button type="button" className="small-btn" onClick={addChapterRow}>+ Add chapter</button>
            </div>
            {formData.chapters.map((chapter, index) => (
              <div key={index} className="chapter-row">
                <div className="form-row">
                  <div className="form-group">
                    <label>Chapter #{chapter.number} title</label>
                    <input value={chapter.title} onChange={(e) => updateChapter(index, { title: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Chapter files (images or PDF)</label>
                    <input
                      type="file"
                      accept="image/*,.pdf,application/pdf"
                      multiple
                      onChange={(e) => handleChapterFiles(index, e.target.files)}
                    />
                    <small className="file-counter">
                      {(chapter.pageFiles || []).length} file selected
                    </small>
                  </div>
                </div>
                {formData.chapters.length > 1 && (
                  <button type="button" className="small-btn danger" onClick={() => removeChapterRow(index)}>Remove</button>
                )}
              </div>
            ))}
          </div>
        )}

        {message && <p className="upload-message">{message}</p>}

        <button type="submit" className="upload-btn" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload content'}
        </button>
      </form>
    </div>
  );
};

export default UploadContent;

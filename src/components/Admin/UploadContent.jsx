import React, { useState } from 'react';
import { chapterApi, mangaApi } from '../../utils/api';
import './UploadContent.css';

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
    coverFile: null,
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

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      category: 'manga',
      tags: '',
      coverFile: null,
      videoUrl: '',
      chapters: [emptyChapter(1)]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    try {
      if (contentType !== 'manga') {
        throw new Error('VIDEO_NOT_SUPPORTED');
      }

      if (!formData.coverFile) {
        throw new Error('COVER_REQUIRED');
      }

      const mangaPayload = new FormData();
      mangaPayload.append('title', formData.title);
      mangaPayload.append('description', formData.description);
      mangaPayload.append('author', formData.author);
      mangaPayload.append('genres', formData.tags);
      mangaPayload.append('category', formData.category);
      mangaPayload.append('coverImage', formData.coverFile);

      const mangaResponse = await mangaApi.create(mangaPayload);
      const createdManga = mangaResponse.data;

      for (const chapter of formData.chapters) {
        const files = Array.isArray(chapter.pageFiles) ? chapter.pageFiles : [];
        if (!files.length) continue;

        const chapterPayload = new FormData();
        chapterPayload.append('mangaId', createdManga._id);
        chapterPayload.append('title', chapter.title || `Chapter ${chapter.number}`);
        chapterPayload.append('chapterNumber', String(chapter.number));

        files.forEach((file) => {
          chapterPayload.append('images', file);
        });

        await chapterApi.create(chapterPayload);
      }

      setMessage('Content uploaded successfully to backend.');
      resetForm();
    } catch (error) {
      if (error?.message === 'VIDEO_NOT_SUPPORTED') {
        setMessage('Video upload backend hali yoq. Hozircha manga upload qiling.');
      } else if (error?.message === 'COVER_REQUIRED') {
        setMessage('Cover image majburiy.');
      } else {
        const apiMessage = error?.response?.data?.message;
        setMessage(apiMessage || 'Upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-content">
      <h2>Content Upload</h2>

      <div className="content-type-tabs">
        <button
          type="button"
          className={`type-tab ${contentType === 'manga' ? 'active' : ''}`}
          onClick={() => {
            setContentType('manga');
            updateField('category', 'manga');
          }}
        >
          <i className="fas fa-book"></i> Manga / Manhwa
        </button>
        <button
          type="button"
          className={`type-tab ${contentType === 'video' ? 'active' : ''}`}
          onClick={() => {
            setContentType('video');
            updateField('category', 'amv');
          }}
        >
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
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tags</label>
            <input
              value={formData.tags}
              onChange={(e) => updateField('tags', e.target.value)}
              placeholder="action, drama, fantasy"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label>Cover image *</label>
          <input
            type="file"
            accept="image/*"
            required={contentType === 'manga'}
            onChange={(e) => updateField('coverFile', e.target.files?.[0] || null)}
          />
        </div>

        {contentType === 'video' && (
          <div className="form-group">
            <label>Video URL *</label>
            <input
              value={formData.videoUrl}
              onChange={(e) => updateField('videoUrl', e.target.value)}
              placeholder="https://..."
              required
            />
          </div>
        )}

        {contentType === 'manga' && (
          <div className="chapters-section">
            <div className="chapters-header">
              <h3>Chapters</h3>
              <button type="button" className="small-btn" onClick={addChapterRow}>
                + Add chapter
              </button>
            </div>
            {formData.chapters.map((chapter, index) => (
              <div key={index} className="chapter-row">
                <div className="form-row">
                  <div className="form-group">
                    <label>Chapter #{chapter.number} title</label>
                    <input
                      value={chapter.title}
                      onChange={(e) => updateChapter(index, { title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Chapter files (images only)</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleChapterFiles(index, e.target.files)}
                    />
                    <small className="file-counter">{(chapter.pageFiles || []).length} file selected</small>
                  </div>
                </div>
                {formData.chapters.length > 1 && (
                  <button type="button" className="small-btn danger" onClick={() => removeChapterRow(index)}>
                    Remove
                  </button>
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

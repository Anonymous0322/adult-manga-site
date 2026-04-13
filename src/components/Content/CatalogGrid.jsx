import React, { useMemo, useState } from 'react';
import MangaCard from './MangaCard';
import { getAllContent } from '../../utils/contentStore';
import './CatalogGrid.css';

const PAGE_SIZE = 8;

const mapItemForCard = (item) => ({
  ...item,
  type: item.contentType === 'video' ? 'Video' : item.category,
  chapters: Array.isArray(item.chapters) ? item.chapters.length : 0
});

const sortByMode = (items, sortBy) => {
  const cloned = [...items];
  switch (sortBy) {
    case 'newest':
      return cloned.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    case 'rating':
      return cloned.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'views':
      return cloned.sort((a, b) => (b.views || 0) - (a.views || 0));
    case 'chapters':
      return cloned.sort((a, b) => (b.chapters || 0) - (a.chapters || 0));
    case 'popular':
    default:
      return cloned.sort((a, b) => (b.views || 0) - (a.views || 0));
  }
};

const buildCollectionData = (items) =>
  items.map((item) => ({
    ...item,
    title: `${item.title} Collection`,
    category: 'collection'
  }));

const buildReviewData = (items) =>
  items.map((item) => ({
    ...item,
    title: `${item.title} Review`,
    category: 'review'
  }));

const CatalogGrid = ({ filters, mode = 'all', heading = 'Catalog', onResetFilters }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);

  const data = useMemo(() => getAllContent().map(mapItemForCard), []);

  const modeData = useMemo(() => {
    if (mode === 'titles') return data.filter((item) => item.contentType === 'manga');
    if (mode === 'reading-now') {
      return data
        .filter((item) => item.contentType === 'manga')
        .slice()
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 20);
    }
    if (mode === 'collections') return buildCollectionData(data.filter((item) => item.contentType === 'manga'));
    if (mode === 'reviews') return buildReviewData(data.filter((item) => item.contentType === 'manga'));
    return data;
  }, [data, mode]);

  const filteredData = useMemo(() => {
    const byType = modeData.filter((item) => {
      if (filters.type === 'all') return true;
      if (filters.type === 'video') return item.contentType === 'video';
      return item.category === filters.type;
    });

    const byGenre =
      filters.genres.length > 0
        ? byType.filter((item) =>
            filters.genres.some((genre) => (item.tags || []).map((g) => g.toLowerCase()).includes(genre.toLowerCase()))
          )
        : byType;

    return sortByMode(byGenre, filters.sortBy);
  }, [modeData, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageData = filteredData.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="catalog-grid">
      <div className="grid-header">
        <div className="results-info">
          <h3><i className="fas fa-layer-group"></i> {heading}: <span className="count">{filteredData.length}</span></h3>
          <p className="filter-info">Showing {safePage} / {totalPages} page</p>
        </div>
        <div className="grid-controls">
          <div className="view-controls">
            <span className="view-label">View:</span>
            <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
              <i className="fas fa-th-large"></i>
            </button>
            <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      {pageData.length > 0 ? (
        <div className={`grid-content ${viewMode}-view`}>
          {pageData.map((item) => (
            <MangaCard key={item.id} manga={item} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results-content">
            <i className="fas fa-search"></i>
            <h3>No results</h3>
            <p>Try changing filters or reset them.</p>
            <button className="reset-btn" onClick={onResetFilters}>
              <i className="fas fa-redo"></i>
              Reset filters
            </button>
          </div>
        </div>
      )}

      {filteredData.length > 0 && (
        <div className="pagination">
          <button className="page-btn" disabled={safePage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <i className="fas fa-chevron-left"></i>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} className={`page-btn ${safePage === p ? 'active' : ''}`} onClick={() => setPage(p)}>
              {p}
            </button>
          ))}
          <button
            className="page-btn"
            disabled={safePage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default CatalogGrid;

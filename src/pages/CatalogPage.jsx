import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import CatalogGrid from '../components/Content/CatalogGrid';
import UsersCatalog from '../components/Content/UsersCatalog';
import CharactersCatalog from '../components/Content/CharactersCatalog';
import './CatalogPage.css';

const defaultFilters = { type: 'all', sortBy: 'popular', genres: [] };

const genres = ['Action', 'Romance', 'Drama', 'Comedy', 'Fantasy', 'Sci-Fi', 'Horror', 'Adventure'];

const titles = {
  users: 'Users',
  characters: 'Characters',
  titles: 'Titles',
  'reading-now': 'Reading Now',
  collections: 'Collections',
  reviews: 'Reviews',
  manga: 'Manga',
  manhwa: 'Manhwa',
  manhua: 'Manhua',
  video: 'Video',
  all: 'Catalog'
};

const descriptions = {
  users: 'Find readers, moderators, and active community members.',
  characters: 'Most loved characters from manga and manhwa.',
  titles: 'All published titles in one place.',
  'reading-now': 'Trending stories users are reading now.',
  collections: 'Curated collections and recommendations.',
  reviews: 'Latest community reviews and ratings.',
  manga: 'Japanese manga titles.',
  manhwa: 'Korean manhwa titles.',
  manhua: 'Chinese manhua titles.',
  video: 'Video content uploaded by admins.'
};

const mapCategoryType = (category) => {
  if (category === 'manga' || category === 'manhwa' || category === 'manhua' || category === 'video') {
    return category;
  }
  return 'all';
};

const getCategoryTitle = (category) => titles[category] || titles.all;
const getCategoryDescription = (category) => descriptions[category] || 'Explore and discover content.';

const CatalogPage = () => {
  const { category = 'all' } = useParams();
  const [filters, setFilters] = useState(defaultFilters);

  const categoryType = mapCategoryType(category);
  const activeFilters = useMemo(
    () => (categoryType === 'all' ? filters : { ...filters, type: categoryType }),
    [filters, categoryType]
  );

  const handleFilterChange = (name, value) => setFilters((prev) => ({ ...prev, [name]: value }));
  const handleResetFilters = () => setFilters(defaultFilters);
  const toggleGenre = (genre) => {
    setFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre) ? prev.genres.filter((g) => g !== genre) : [...prev.genres, genre]
    }));
  };

  const showSidebar = !['users', 'characters'].includes(category);

  const contentNode =
    category === 'users' ? (
      <div className="catalog-main"><UsersCatalog /></div>
    ) : category === 'characters' ? (
      <div className="catalog-main"><CharactersCatalog /></div>
    ) : (
      <div className="catalog-main">
        <CatalogGrid
          filters={activeFilters}
          mode={category}
          heading={getCategoryTitle(category)}
          onResetFilters={handleResetFilters}
        />
      </div>
    );

  return (
    <div className="catalog-page">
      <div className="page-header">
        <div className="header-content">
          <h1>{getCategoryTitle(category)}</h1>
          <p>{getCategoryDescription(category)}</p>
        </div>
      </div>

      <div className={`catalog-layout ${showSidebar ? '' : 'no-sidebar'}`.trim()}>
        {showSidebar && (
          <aside className="filters-sidebar">
            <div className="filter-section">
              <div className="filter-header">
                <h3><i className="fas fa-filter"></i> Filters</h3>
                <button className="reset-filters-btn" onClick={handleResetFilters}>Reset</button>
              </div>

              <div className="filter-group">
                <label>Type</label>
                <select className="filter-select" value={activeFilters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
                  <option value="all">All</option>
                  <option value="manga">Manga</option>
                  <option value="manhwa">Manhwa</option>
                  <option value="manhua">Manhua</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Sort</label>
                <select className="filter-select" value={activeFilters.sortBy} onChange={(e) => handleFilterChange('sortBy', e.target.value)}>
                  <option value="popular">Popular</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Rating</option>
                  <option value="views">Views</option>
                  <option value="chapters">Chapters</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Genres</label>
                <div className="genres-grid">
                  {genres.map((genre) => (
                    <button key={genre} className={`genre-tag ${activeFilters.genres.includes(genre) ? 'active' : ''}`} onClick={() => toggleGenre(genre)}>
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}
        {contentNode}
      </div>
    </div>
  );
};

export default CatalogPage;

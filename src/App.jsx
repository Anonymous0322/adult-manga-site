import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ForumPage from './pages/ForumPage';
import AdminPage from './pages/AdminPage';
import ContentPage from './pages/ContentPage';
import ProfilePage from './pages/ProfilePage';
import LibraryPage from './pages/LibraryPage';
import SettingsPage from './pages/SettingsPage';
import ReadPage from './pages/ReadPage';
import AdminRoute from './components/Admin/AdminRoute';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ContentProvider>
          <Router>
            <div className="app">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/catalog" element={<CatalogPage />} />
                  <Route path="/catalog/:category" element={<CatalogPage />} />
                  <Route path="/catalog/category/:category" element={<CatalogPage />} />
                  <Route path="/forum" element={<ForumPage />} />
                  <Route
                    path="/admin/*"
                    element={
                      <AdminRoute>
                        <AdminPage />
                      </AdminRoute>
                    }
                  />
                  <Route path="/content/:id" element={<ContentPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/library" element={<LibraryPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/read/:contentId/:chapterNumber" element={<ReadPage />} />
                </Routes>
              </main>
            </div>
          </Router>
        </ContentProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

import React, { createContext, useContext, useMemo, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    catalog: 'Catalog',
    forum: 'Forum',
    search: 'Search',
    settings: 'Settings',
    language: 'Language',
    save: 'Save',
    adminPanel: 'Admin Panel',
    users: 'Users',
    contentUpload: 'Content Upload',
    analytics: 'Analytics',
    contentManagement: 'Content Management',
    commentsModeration: 'Comments Moderation'
  },
  uz: {
    catalog: 'Katalog',
    forum: 'Forum',
    search: 'Qidirish',
    settings: 'Sozlamalar',
    language: 'Til',
    save: 'Saqlash',
    adminPanel: 'Admin Panel',
    users: 'Foydalanuvchilar',
    contentUpload: 'Kontent Yuklash',
    analytics: 'Analitika',
    contentManagement: 'Kontent Boshqaruvi',
    commentsModeration: 'Komment Moderatsiyasi'
  },
  ru: {
    catalog: 'Каталог',
    forum: 'Форум',
    search: 'Поиск',
    settings: 'Настройки',
    language: 'Язык',
    save: 'Сохранить',
    adminPanel: 'Админ-панель',
    users: 'Пользователи',
    contentUpload: 'Загрузка контента',
    analytics: 'Аналитика',
    contentManagement: 'Управление контентом',
    commentsModeration: 'Модерация комментариев'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('mangauz_language') || 'uz');

  const t = (key) => translations[language]?.[key] || translations.en[key] || key;

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('mangauz_language', lang);
  };

  const value = useMemo(
    () => ({
      language,
      t,
      changeLanguage
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

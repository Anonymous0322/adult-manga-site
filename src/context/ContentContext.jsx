import React, { createContext, useState, useContext } from 'react';

export const ContentContext = createContext();

export const useContent = () => {
  return useContext(ContentContext);
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState([]);
  
  const [categories] = useState([
    'Манга',
    'OEL-манга', 
    'Манхва',
    'Маньхуа',
    'Руманга',
    'Комикс',
    'Видео'
  ]);

  const [catalogItems] = useState([
    'Пользователи',
    'Персонажи', 
    'Тайтлы',
    'Сейчас читают',
    'Коллекции',
    'Отзывы и Рецензии'
  ]);

  const addContent = (newContent) => {
    setContent(prev => [...prev, newContent]);
  };

  const value = {
    content,
    categories,
    catalogItems,
    addContent
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

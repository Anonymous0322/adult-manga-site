export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getLevelFromPoints = (points) => {
  const levels = [
    { level: 1, min: 0 },
    { level: 2, min: 500 },
    { level: 3, min: 2000 },
    { level: 4, min: 5000 },
    { level: 5, min: 10000 }
  ];
  
  for (let i = levels.length - 1; i >= 0; i--) {
    if (points >= levels[i].min) {
      return levels[i].level;
    }
  }
  return 1;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateUsername = (username) => {
  return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);
};

export const validateContentTitle = (title) => {
  return title.length >= 3 && title.length <= 200;
};

export const validateDescription = (description) => {
  return description.length <= 1000;
};

export const validateTags = (tags) => {
  if (!tags) return true;
  const tagArray = tags.split(',').map(tag => tag.trim());
  return tagArray.length <= 10 && tagArray.every(tag => tag.length <= 30);
};

export const validateFile = (file, allowedTypes, maxSizeMB) => {
  if (!file) return true;
  
  const isValidType = allowedTypes.some(type => file.type.includes(type));
  const isValidSize = file.size <= maxSizeMB * 1024 * 1024;
  
  return isValidType && isValidSize;
};

export const getValidationError = (field, value) => {
  switch (field) {
    case 'email':
      if (!value) return 'Email обязателен';
      if (!validateEmail(value)) return 'Неверный формат email';
      return '';
      
    case 'password':
      if (!value) return 'Пароль обязателен';
      if (!validatePassword(value)) return 'Пароль должен содержать минимум 6 символов';
      return '';
      
    case 'username':
      if (!value) return 'Имя пользователя обязательно';
      if (!validateUsername(value)) return 'Имя пользователя должно содержать 3-20 символов (буквы, цифры, _)';
      return '';
      
    case 'title':
      if (!value) return 'Название обязательно';
      if (!validateContentTitle(value)) return 'Название должно содержать 3-200 символов';
      return '';
      
    default:
      return '';
  }
};
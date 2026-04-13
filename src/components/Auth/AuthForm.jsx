import React, { useState } from 'react';
import './AuthForm.css';

const AuthForm = ({ type = 'login', onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }
    
    if (type === 'register' && !formData.username) {
      newErrors.username = 'Имя пользователя обязательно';
    } else if (type === 'register' && formData.username.length < 3) {
      newErrors.username = 'Минимум 3 символа';
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Минимум 6 символов';
    }
    
    if (type === 'register' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>{type === 'login' ? 'Вход в аккаунт' : 'Регистрация'}</h2>
      </div>
      
      <div className="form-body">
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Введите ваш email"
            className={errors.email ? 'error' : ''}
            disabled={loading}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        
        {type === 'register' && (
          <div className="form-group">
            <label htmlFor="username">Имя пользователя *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Введите имя пользователя"
              className={errors.username ? 'error' : ''}
              disabled={loading}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="password">Пароль *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль"
            className={errors.password ? 'error' : ''}
            disabled={loading}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        
        {type === 'register' && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Повторите пароль"
              className={errors.confirmPassword ? 'error' : ''}
              disabled={loading}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
        )}
        
        {type === 'login' && (
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Запомнить меня</span>
            </label>
            <button type="button" className="forgot-password">
              Забыли пароль?
            </button>
          </div>
        )}
        
        {type === 'register' && (
          <div className="form-options">
            <label className="terms-agreement">
              <input type="checkbox" required />
              <span>Я согласен с условиями использования</span>
            </label>
          </div>
        )}
      </div>
      
      <div className="form-footer">
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              {type === 'login' ? 'Вход...' : 'Регистрация...'}
            </>
          ) : (
            type === 'login' ? 'Войти' : 'Зарегистрироваться'
          )}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
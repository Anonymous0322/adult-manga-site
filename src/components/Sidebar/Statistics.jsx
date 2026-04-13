import React from 'react';
import './Statistics.css';

const Statistics = () => {
  const stats = [
    { label: 'Всего манги', value: '1,245', icon: 'fa-book', color: '#ff6b6b' },
    { label: 'Всего видео', value: '563', icon: 'fa-video', color: '#4ecdc4' },
    { label: 'Пользователей', value: '24,589', icon: 'fa-users', color: '#45b7d1' },
    { label: 'Онлайн сейчас', value: '1,245', icon: 'fa-eye', color: '#96ceb4' }
  ];

  return (
    <div className="statistics-card">
      <h3>Статистика сайта</h3>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div className="stat-info">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="stats-chart">
        <h4>Активность за неделю</h4>
        <div className="chart-bars">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
            <div key={day} className="chart-bar">
              <div 
                className="bar-fill" 
                style={{ height: `${30 + index * 10}%` }}
              ></div>
              <span className="bar-label">{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
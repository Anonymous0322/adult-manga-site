import React, { useState } from 'react';
import './Rating.css';

const Rating = ({ 
  value = 0, 
  max = 5, 
  onChange, 
  readOnly = false,
  size = 'medium',
  showValue = false 
}) => {
  const [hoverValue, setHoverValue] = useState(0);
  
  const handleClick = (newValue) => {
    if (!readOnly && onChange) {
      onChange(newValue);
    }
  };
  
  const handleMouseEnter = (value) => {
    if (!readOnly) {
      setHoverValue(value);
    }
  };
  
  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(0);
    }
  };
  
  const stars = Array.from({ length: max }, (_, index) => {
    const starValue = index + 1;
    const isFilled = starValue <= (hoverValue || value);
    
    return (
      <span
        key={index}
        className={`star ${isFilled ? 'filled' : 'empty'} ${size}`}
        onClick={() => handleClick(starValue)}
        onMouseEnter={() => handleMouseEnter(starValue)}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: readOnly ? 'default' : 'pointer' }}
      >
        <i className={`fas fa-star ${isFilled ? 'filled' : 'empty'}`}></i>
      </span>
    );
  });
  
  return (
    <div className="rating">
      <div className="stars-container">
        {stars}
      </div>
      {showValue && (
        <span className="rating-value">
          {value.toFixed(1)}/{max}
        </span>
      )}
    </div>
  );
};

export default Rating;
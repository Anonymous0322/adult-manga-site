import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  const buttonClass = `ui-button ${variant} ${size} ${fullWidth ? 'full-width' : ''} ${className}`;
  
  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="button-icon">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="button-icon">{icon}</span>}
    </button>
  );
};

export default Button;
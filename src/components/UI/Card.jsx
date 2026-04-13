import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  className = '', 
  hoverable = false,
  padding = 'medium',
  variant = 'default',
  ...props 
}) => {
  const cardClass = `ui-card ${variant} ${padding} ${hoverable ? 'hoverable' : ''} ${className}`;
  
  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', ...props }) => (
  <div className={`card-body ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card-footer ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
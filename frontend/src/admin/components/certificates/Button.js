import React from 'react';

const Button = ({ children, className, onClick, type = 'button' }) => {
  return (
    <button
      type={type}
      className={`px-4 py-2 font-semibold rounded-md ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;

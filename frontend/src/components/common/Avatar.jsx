import React from 'react';

export const Avatar = ({ name, size = 'md', className = '' }) => {
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: 'avatar-initials avatar-initials-sm',
    md: 'avatar-initials avatar-initials-md',
    lg: 'avatar-initials avatar-initials-lg',
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {getInitials(name)}
    </div>
  );
};


import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div 
      className={`bg-[rgba(24,24,27,0.4)] border border-[rgba(255,255,255,0.1)] rounded-2xl backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

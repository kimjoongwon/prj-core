import React from 'react';

export interface SpacerProps {
  /**
   * Size of spacer in Tailwind's spacing units (0.25rem increments)
   * 1 = 0.25rem (4px)
   * 2 = 0.5rem (8px)
   * 3 = 0.75rem (12px)
   * 4 = 1rem (16px)
   * and so on...
   */
  size?: number;
  
  /**
   * Direction of the spacer - horizontal or vertical
   */
  direction?: 'horizontal' | 'vertical';

  /**
   * Optional additional className
   */
  className?: string;
}

/**
 * Spacer component that creates empty space with configurable size using Tailwind's spacing units
 */
export const Spacer: React.FC<SpacerProps> = ({ 
  size = 4, 
  direction = 'vertical',
  className = '',
}) => {
  const spacingClass = `${direction === 'horizontal' ? 'w' : 'h'}-${size}`;
  
  return (
    <div 
      className={`${spacingClass} ${className}`}
      aria-hidden="true"
    />
  );
};

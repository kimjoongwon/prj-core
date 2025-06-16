import { SpacerProps } from '@shared/types';
import React from 'react';

/**
 * Spacer component that creates empty space with configurable size using Tailwind's spacing units
 */
export const Spacer: React.FC<SpacerProps> = ({
  size = 4,
  direction = 'vertical',
  className = '',
}) => {
  const spacingClass = `${direction === 'horizontal' ? 'w' : 'h'}-${size}`;

  return <div className={`${spacingClass} ${className}`} aria-hidden="true" />;
};

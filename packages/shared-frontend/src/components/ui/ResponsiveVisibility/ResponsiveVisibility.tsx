'use client';

import React from 'react';
import { ResponsiveVisibilityProps } from '@shared/types';

/**
 * ResponsiveVisibility component for conditionally hiding elements based on device type
 *
 * @param device - 'mobile' hides on mobile devices, 'pc' hides on desktop devices
 * @param breakpoint - Responsive breakpoint (default: 'xl' - 1280px)
 * @param children - The content to conditionally show/hide
 * @param className - Additional CSS classes
 *
 * @example
 * // Hide on mobile (only show on desktop)
 * <ResponsiveVisibility device="mobile">
 *   <div>This is only visible on desktop</div>
 * </ResponsiveVisibility>
 *
 * @example
 * // Hide on desktop (only show on mobile)
 * <ResponsiveVisibility device="pc">
 *   <div>This is only visible on mobile</div>
 * </ResponsiveVisibility>
 *
 * @example
 * // Use different breakpoint
 * <ResponsiveVisibility device="mobile" breakpoint="lg">
 *   <div>Hidden on mobile, shown on large screens and up</div>
 * </ResponsiveVisibility>
 */
export const ResponsiveVisibility: React.FC<ResponsiveVisibilityProps> = ({
  children,
  device,
  breakpoint = 'xl',
  className = '',
}) => {
  // Generate responsive classes based on device prop and breakpoint
  const getResponsiveClasses = () => {
    if (device === 'mobile') {
      // Hide on mobile, show on breakpoint and above
      return `hidden ${breakpoint}:block`;
    } else if (device === 'pc') {
      // Show on mobile, hide on breakpoint and above
      return `block ${breakpoint}:hidden`;
    }
    return '';
  };

  return (
    <div className={`${getResponsiveClasses()} ${className}`}>{children}</div>
  );
};

ResponsiveVisibility.displayName = 'ResponsiveVisibility';

// Convenient alias components for better readability
interface ConditionalVisibilityProps
  extends Omit<ResponsiveVisibilityProps, 'device'> {}

/**
 * Shows content only on desktop (hidden on mobile)
 */
export const DesktopOnly: React.FC<ConditionalVisibilityProps> = props => (
  <ResponsiveVisibility device="mobile" {...props} />
);

/**
 * Shows content only on mobile (hidden on desktop)
 */
export const MobileOnly: React.FC<ConditionalVisibilityProps> = props => (
  <ResponsiveVisibility device="pc" {...props} />
);

DesktopOnly.displayName = 'DesktopOnly';
MobileOnly.displayName = 'MobileOnly';

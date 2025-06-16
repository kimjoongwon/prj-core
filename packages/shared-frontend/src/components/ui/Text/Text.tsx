import { cva } from 'class-variance-authority';
import { TextProps } from '@shared/types';
import React, { forwardRef } from 'react';

const text = cva('transition-colors duration-200', {
  variants: {
    variant: {
      h1: 'text-4xl font-bold text-foreground dark:text-foreground',
      h2: 'text-3xl font-bold text-foreground dark:text-foreground',
      h3: 'text-2xl font-bold text-foreground dark:text-foreground',
      h4: 'text-xl font-bold text-foreground dark:text-foreground',
      h5: 'text-lg font-bold text-foreground dark:text-foreground',
      h6: 'text-base font-bold text-foreground dark:text-foreground',
      caption: 'text-sm font-normal text-default-500 dark:text-default-400',
      subtitle1: 'text-base font-normal text-default-600 dark:text-default-300',
      subtitle2: 'text-sm font-normal text-default-600 dark:text-default-300',
      body1: 'text-base font-normal text-foreground dark:text-foreground',
      body2: 'text-sm font-normal text-foreground dark:text-foreground',
      title: 'text-xl font-normal text-foreground dark:text-foreground',
      label: 'text-sm font-semibold text-default-700 dark:text-default-300',
      text: 'text-base font-normal text-foreground dark:text-foreground',
      error: 'text-sm font-medium text-danger dark:text-danger',
    },
    truncate: {
      true: 'truncate',
      false: '',
    },
    lineClamp: {
      1: 'line-clamp-1',
      2: 'line-clamp-2',
      3: 'line-clamp-3',
      4: 'line-clamp-4',
      5: 'line-clamp-5',
      6: 'line-clamp-6',
      none: '',
    },
  },
  defaultVariants: {
    variant: 'body1',
    truncate: false,
    lineClamp: 'none',
  },
});

// Semantic HTML tag mapping for better accessibility
const getSemanticTag = (
  variant: TextProps['variant'],
): keyof React.JSX.IntrinsicElements => {
  switch (variant) {
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    case 'h4':
      return 'h4';
    case 'h5':
      return 'h5';
    case 'h6':
      return 'h6';
    case 'caption':
    case 'label':
      return 'span';
    default:
      return 'p';
  }
};

/**
 * A versatile text component that provides semantic HTML elements with consistent styling.
 * Supports dark mode and provides appropriate text colors for different contexts.
 *
 * @example
 * ```tsx
 * // Basic usage with semantic HTML
 * <Text variant="h1">Main Title</Text>
 * <Text variant="body1">Regular paragraph text</Text>
 * <Text variant="caption">Small caption text</Text>
 *
 * // Custom element with 'as' prop
 * <Text as="span" variant="label">Inline label</Text>
 * <Text as="div" variant="title">Title as div</Text>
 *
 * // With custom className
 * <Text variant="h2" className="mb-4 text-center">Centered heading</Text>
 * ```
 */
export const Text = forwardRef<HTMLElement, TextProps>((props, ref) => {
  const {
    children,
    className,
    variant = 'body1',
    truncate = false,
    lineClamp = 'none',
    as,
    // DOM에 전달되면 안 되는 커스텀 props들을 제외
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReadOnly,
    isInvalid,
    errorMessage,
    ...rest
  } = props as TextProps & {
    isReadOnly?: boolean;
    isInvalid?: boolean;
    errorMessage?: string;
  };

  // Use custom tag if provided, otherwise use semantic tag based on variant
  const Tag = (as || getSemanticTag(variant)) as React.ElementType;

  // Generate classes using cva
  const classes = text({ variant, truncate, lineClamp });

  return (
    <Tag {...rest} ref={ref} className={`${classes} ${className || ''}`}>
      {children}
    </Tag>
  );
});

Text.displayName = 'Text';

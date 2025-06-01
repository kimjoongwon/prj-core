'use client';

import { Button } from '@heroui/react';
import { useTheme } from '@heroui/use-theme';
import { observer } from 'mobx-react-lite';
import { Moon, Sun } from 'lucide-react';
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const darkModeSwitchStyles = cva('fixed p-2 z-50', {
  variants: {
    position: {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4',
    },
    size: {
      sm: 'text-sm',
      md: 'text-md',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    position: 'bottom-right',
    size: 'md',
  },
});

export interface DarkModeSwitchProps
  extends VariantProps<typeof darkModeSwitchStyles> {
  /**
   * Optional class name for additional styling
   */
  className?: string;
}

/**
 * DarkModeSwitch component that allows users to toggle between light and dark modes
 * It can be positioned in any of the four corners of the screen
 */
export const DarkModeSwitch = observer((props: DarkModeSwitchProps) => {
  const { position, size, className } = props;
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      isIconOnly
      variant="ghost"
      radius="full"
      className={darkModeSwitchStyles({ position, size, className })}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      onPress={toggleTheme}
    >
      {theme === 'dark' ? (
        <Sun size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
      ) : (
        <Moon size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
      )}
    </Button>
  );
});

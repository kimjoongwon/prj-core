'use client';

import { Button } from '../Button/Button';
import { cn } from '@heroui/react';
import { HStack } from '../HStack';

export interface LogoProps {
  variants: 'text' | 'icon';
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const Logo = (props: LogoProps) => {
  const { className } = props;

  return (
    <HStack className="items-center">
      {/* <Image src="/logo.png" alt="logo" width={50} height={50} /> */}
      <Button
        variant="light"
        className={cn(className, 'font-bold text-2xl p-0')}
      >
        플레이트
      </Button>
    </HStack>
  );
};

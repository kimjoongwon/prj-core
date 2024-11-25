'use client';
// import Image, { ImageProps } from 'next/image';
import { Button } from '../Button';
import { cn } from '@nextui-org/react';

interface LogoProps {
  variants: 'text' | 'icon';
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const Logo = (props: LogoProps) => {
  const { className } = props;

  const onClickLogo = () => {
    // galaxy?.router.push({
    //   url: '/admin/main',
    // });
  };

  return (
    <Button
      variant="light"
      className={cn(className, 'font-bold text-2xl p-0')}
      onClick={onClickLogo}
    >
      Hello World!
    </Button>
  );
};

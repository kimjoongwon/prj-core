'use client';
// import Image, { ImageProps } from 'next/image';
import { galaxy } from '../../../providers/App';
import { Button } from '../Button';
import { cn } from '@nextui-org/react';

interface LogoProps {
  variants: 'text' | 'icon';
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const Logo = (props: LogoProps) => {
  const { children, variants = 'text', className } = props;

  const onClickLogo = () => {
    // galaxy?.router.push({
    //   url: '/admin/main',
    // });
  };

  return (
    <Button
      variant="light"
      className={cn(className, 'font-bold text-2xl')}
      onClick={onClickLogo}
    >
      Hello World!
    </Button>
  );
};

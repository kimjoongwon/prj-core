'use client';
import Image, { ImageProps } from 'next/image';
import { galaxy } from '../../../providers/App';
import { Button } from '../Button';

interface LogoProps extends Omit<ImageProps, 'src'> {
  variants: 'text' | 'icon';
  onClick?: () => void;
}

export const Logo = (props: LogoProps) => {
  const onClickLogo = () => {
    galaxy?.router.push({
      url: '/admin/main',
    });
  };

  const { children, variants = 'text' } = props;
  if (variants === 'text') {
    return (
      <Button
        variant="light"
        className="font-bold text-2xl"
        onClick={onClickLogo}
      >
        로고영역
      </Button>
    );
  }
  return (
    <Image src={''} {...props}>
      {children}
    </Image>
  );
};

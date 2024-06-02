import Image, { ImageProps } from 'next/image';
import Button from '../Button';
import { myUniv } from '../../../providers/App';

interface LogoProps extends Omit<ImageProps, 'src'> {
  variants: 'text' | 'icon';
  onClick?: () => void;
}

export const Logo = (props: LogoProps) => {
  const onClickLogo = () => {
    myUniv?.router.push({
      url: '/admin/main',
    });
  };

  const { children, variants = 'text' } = props;
  if (variants === 'text') {
    return (
      <Button
        variant="light"
        onClick={onClickLogo}
        className="text-large font-bold p-0 m-0"
      >
        LOGO
      </Button>
    );
  }
  return (
    <Image src={''} {...props}>
      {children}
    </Image>
  );
};

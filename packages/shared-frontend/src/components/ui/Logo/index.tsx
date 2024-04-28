import Image, { ImageProps } from 'next/image';
import { Text } from '../Text';

interface LogoProps extends Omit<ImageProps, 'src'> {
  variants: 'text' | 'icon';
  onClick?: () => void;
}

export const Logo = (props: LogoProps) => {
  const { children, variants = 'text' } = props;
  if (variants === 'text') {
    return <Text className="text-large font-bold">LOGO</Text>;
  }
  return (
    <Image src={''} {...props}>
      {children}
    </Image>
  );
};

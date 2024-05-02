import Image, { ImageProps } from 'next/image';
import { Text } from '../Text';
import { router } from '../../../stores';

interface LogoProps extends Omit<ImageProps, 'src'> {
  variants: 'text' | 'icon';
  onClick?: () => void;
}

export const Logo = (props: LogoProps) => {
  const onClickLogo = () => {
    router.push({
      url: '/admin/service',
    });
  };

  const { children, variants = 'text' } = props;
  if (variants === 'text') {
    return (
      <Text className="text-large font-bold" onClick={onClickLogo}>
        LOGO
      </Text>
    );
  }
  return (
    <Image src={''} {...props}>
      {children}
    </Image>
  );
};

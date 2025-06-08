import { User, Avatar as HeroUIAvatar } from '@heroui/react';
import { observer } from 'mobx-react-lite';

interface AvatarProps {
  showInfo?: boolean;
}

export const Avatar = observer((props: AvatarProps) => {
  const { showInfo = true } = props;

  if (showInfo) {
    // Desktop: Show full user info
    return (
      <User
        name="슈퍼매니저"
        description="총괄"
        avatarProps={{
          src: '/moka.png',
        }}
      />
    );
  }

  // Mobile: Show only avatar image
  return (
    <HeroUIAvatar
      src="/moka.png"
      name="슈퍼매니저"
      size="sm"
    />
  );
});

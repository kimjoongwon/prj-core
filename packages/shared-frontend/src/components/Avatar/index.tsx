import { User } from '@heroui/react';
import { observer } from 'mobx-react-lite';

export const Avatar = observer(() => {
  return (
    <User
      name="슈퍼매니저"
      description="총괄"
      avatarProps={{
        src: '/moka.png',
      }}
    />
  );
});

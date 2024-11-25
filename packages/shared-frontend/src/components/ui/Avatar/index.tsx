import { User } from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
// @ts-ignore
import image from './image.png';

export const Avatar = observer(() => {
  return (
    <User
      className="font-pretendard"
      name="슈퍼매니저"
      description="총괄 리더"
      avatarProps={{
        src: image,
      }}
    />
  );
});

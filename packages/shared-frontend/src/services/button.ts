import { ButtonProps } from '@heroui/react';

export class ButtonService {
  getAdminButtons(): ButtonProps[] {
    return [
      {
        children: '생성',
        color: 'primary',
        onPress: () => {},
      },
    ];
  }
}

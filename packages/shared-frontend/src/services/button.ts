import { ButtonProps } from '@heroui/react';
import { NavigationService } from './navigation';

export class ButtonService {
  constructor(readonly navigationService: NavigationService) {}
  getLeftButtons(domain: string): ButtonProps[] {
    return [
      {
        children: '생성',
        onPress: () => {
          this.navigationService.push(`./${domain}/new/edit`);
        },
      },
      {
        children: '수정',
        onPress: () => {},
      },
    ];
  }
}

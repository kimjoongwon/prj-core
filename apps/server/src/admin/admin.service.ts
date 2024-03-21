import { Injectable } from '@nestjs/common';
import { MenuDto } from './models/Path';

@Injectable()
export class AdminService {
  getMenus(): MenuDto[] {
    return [
      {
        text: '이용자 관리',
        icon: 'dashboard',
        pathname: 'admin/userService/users',
        children: [
          {
            text: '멤버 서비스',
            icon: 'dashboard',
            pathname: 'admin/userService/users',
          },
        ],
      },
    ];
  }
}

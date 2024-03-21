import { Injectable } from '@nestjs/common';
import { MenuDto } from './models/Path';

@Injectable()
export class AdminService {
  getMenus(): MenuDto[] {
    return [
      {
        text: '이용자 관리',
        children: [
          {
            text: '멤버 서비스',
            pathname: 'admin/userService/users',
          },
        ],
      },
    ];
  }
}

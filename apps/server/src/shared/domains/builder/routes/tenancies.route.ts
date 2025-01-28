import { RouteBuilder } from '@shared/types';
import { TenanciesPage } from '../pages/tenancies.page';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TenanciesRoute {
  constructor(private readonly tenanciesPage: TenanciesPage) {}

  getMeta() {
    const page = this.tenanciesPage.getMeta();
    const route: RouteBuilder = {
      name: '공간',
      pathname: 'tenancies',
      page,
    };
    return route;
  }
}

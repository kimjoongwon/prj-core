import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { RouteBuilder } from '@shared/types';
import { LoginPage } from './components/pages/login.page';

@Injectable()
export class AppBuilderService {
  constructor(
    readonly prisma: PrismaService,
    readonly loginPage: LoginPage,
  ) {}

  async build() {
    return {
      routes: this.getRoute(),
    };
  }

  path() {
    return {
      routeName: '',
      state: '',
      routes: {},
    };
  }

  getRoute(): RouteBuilder[] {

  }
}

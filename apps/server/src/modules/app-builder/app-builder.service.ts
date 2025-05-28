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

  getRoute(): RouteBuilder[] {
    return [
      {
        name: '관리자',
        pathname: 'admin',
        children: [
          {
            name: '인증',
            pathname: 'auth',
            children: [
              {
                name: '로그인',
                pathname: 'login',
                page: this.loginPage.build(),
              },
            ],
          },
          {
            name: '공간',
            pathname: 'spaces',
            children: [
              {
                name: '서비스',
                pathname: ':id',
                children: [
                  {
                    name: '그라운드',
                    pathname: 'ground',
                    children: [
                      {
                        name: '리스트',
                        pathname: 'resources',
                        children: [
                          {
                            name: '디테일',
                            pathname: ':id',
                            children: [
                              {
                                name: '편집',
                                pathname: ':type',
                              },
                            ],
                          },
                        ],
                      },
                      {
                        name: '카테고리',
                        pathname: 'categories',
                        children: [
                          {
                            name: '디테일',
                            pathname: ':id',
                            children: [
                              {
                                name: '편집',
                                pathname: ':type',
                              },
                            ],
                          },
                        ],
                      },
                      {
                        name: '그룹',
                        pathname: 'groups',
                        children: [
                          {
                            name: '디테일',
                            pathname: ':id',
                            children: [
                              {
                                name: '편집',
                                pathname: ':type',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: '카테고리',
            pathname: '/admin/main/categories',
            children: [
              {
                name: '편집',
                pathname: '/admin/main/categories/:categoryId/edit',
              },
            ],
          },
        ],
      },
    ];
  }
}

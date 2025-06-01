    return [
      {
        name: '관리자',
        pathname: 'admin',
        layout: {
          type: 'Root',
        },
        children: [
          {
            name: '인증',
            pathname: 'auth',
            layout: {
              type: 'Auth',
            },
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
                    name: '대시보드',
                    pathname: 'dashboard',
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
            ],
          },
        ],
      },
    ];
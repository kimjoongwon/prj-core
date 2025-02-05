import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PageBuilder } from '@shared/types';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AbilityEditPage {
  constructor(private readonly prisma: PrismaService) {}
  async getRoute(): Promise<PageBuilder> {
    const abilityTypeOptions = [
      {
        key: '1',
        text: 'CAN',
        value: $Enums.AbilityTypes.CAN,
      },
      {
        key: '2',
        text: 'CANNOT',
        value: $Enums.AbilityTypes.CAN_NOT,
      },
    ];

    const roles = await this.prisma.role.findMany({
      where: {
        removedAt: null,
      },
    });

    const roleOptions = roles.map((role) => ({
      key: role.id,
      text: role.name,
      value: role.id,
    }));

    const actions = await this.prisma.action.findMany({
      where: {
        removedAt: null,
      },
    });

    const actionOptions = actions.map((action) => ({
      key: action.id,
      text: action.name,
      value: action.id,
    }));

    const subjects = await this.prisma.subject.findMany({
      where: {
        removedAt: null,
      },
    });

    const subjectOptions = subjects.map((subject) => ({
      key: subject.id,
      text: subject.name,
      value: subject.id,
    }));

    return {
      name: '새편집',
      state: {
        form: {
          data: {},
        },
      },
      form: {
        button: {
          name: '저장',
          mutation: {
            name: 'createAbility',
            payloadPath: 'form',
          },
          navigator: {
            pathname: '..',
          },
        },
        sections: [
          {
            name: '기본정보',
            stacks: [
              {
                type: 'VStack',
                inputs: [
                  {
                    type: 'Input',
                    path: 'form.name',
                    props: {
                      fullWidth: true,
                      label: '능력 이름',
                      placeholder: '능력 이름을 입력해주세요.',
                    },
                  },
                  {
                    type: 'Select',
                    path: 'form.roleId',
                    props: {
                      fullWidth: true,
                      label: '역할',
                      options: roleOptions,
                    },
                  },
                  {
                    type: 'Select',
                    path: 'form.type',
                    props: {
                      fullWidth: true,
                      label: '능력 타입',
                      options: abilityTypeOptions,
                    },
                  },
                  {
                    type: 'Select',
                    path: 'form.actionId',
                    props: {
                      fullWidth: true,
                      label: '액션',
                      options: actionOptions,
                    },
                  },
                  {
                    type: 'Select',
                    path: 'form.subjectId',
                    props: {
                      fullWidth: true,
                      label: '과목',
                      options: subjectOptions,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    };
  }
}

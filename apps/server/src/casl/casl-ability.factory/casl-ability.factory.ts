import { Injectable } from '@nestjs/common';
import { $Enums, User } from '@prisma/client';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { PureAbility, AbilityBuilder } from '@casl/ability';
import { PrismaService } from 'nestjs-prisma';
import { UserDto } from '@shared';
type AppSubjects =
  | 'all'
  | Subjects<{
      User: User;
    }>;

type AppAbility = PureAbility<[$Enums.AbilityActions, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private prisma: PrismaService) {}
  async createForUser(user: UserDto) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);
    const tenants = await this.prisma.tenant.findMany({
      where: {
        userId: user.id,
      },
      include: {
        role: {
          include: {
            abilities: {
              include: {
                subject: true,
              },
            },
          },
        },
      },
    });

    const tenant = tenants.find((tenant) => !tenant.active);
    tenant.role.abilities.forEach((ability) => {
      if (ability.type === 'CAN') {
        // @ts-ignore
        can(ability.action, ability.subject.name, ability.conditions);
      } else {
        // @ts-ignore
        cannot(ability.action, ability.subject.name, ability.conditions);
      }
    });

    can('CREATE', 'User', { id: user.id });
    return build();
  }
}

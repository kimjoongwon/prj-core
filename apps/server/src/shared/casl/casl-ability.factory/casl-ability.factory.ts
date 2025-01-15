import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { PureAbility, AbilityBuilder } from '@casl/ability';
import { PrismaService } from 'nestjs-prisma';
import { UserDto } from '@shared';
export type AppAbility = PureAbility<
  [
    string,
    Subjects<{
      User: User;
    }>,
  ],
  PrismaQuery
>;

@Injectable()
export class CaslAbilityFactory {
  // constructor(private prisma: PrismaService) {}
  // async createForUser(user: UserDto) {
  //   const { can, cannot, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);
  //   const tenants = await this.prisma.tenant.findMany({
  //     where: {
  //       userId: user.id,
  //     },
  //     include: {
  //       role: {
  //         include: {
  //           abilities: {
  //             include: {
  //               subject: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   // @ts-ignore
  //   const tenant = tenants[0];
  //   tenant.role.abilities.forEach((ability) => {
  //     if (ability.type === 'CAN') {
  //       // @ts-ignore
  //       can(ability.action, ability.subject.name, ability.conditions);
  //     } else {
  //       // @ts-ignore
  //       cannot(ability.action, ability.subject.name, ability.conditions);
  //     }
  //   });

  //   return build();
  // }
}

// import { Injectable } from '@nestjs/common';
// import { Page, User } from '@coc/database';
// import {
//   Ability,
//   AbilityBuilder,
//   AbilityClass,
//   ExtractSubjectType,
//   InferSubjects,
//   PureAbility,
// } from '@casl/ability';
// import { PrismaService } from 'nestjs-prisma';
// export enum Action {
//   Manage = 'manage',
//   Create = 'create',
//   Read = 'read',
//   Update = 'update',
//   Delete = 'delete',
// }

// type Subjects = InferSubjects<Page> | 'all';

// export type AppAbility = PureAbility<[Action, Subjects]>;

// @Injectable()
// export class CaslAbilityFactory {
//   constructor(private prisma: PrismaService) {}
//   createForUser(user: User) {
//     const { can, cannot, build } = new AbilityBuilder<
//       PureAbility<[Action, Subjects]>
//     >(PureAbility as AbilityClass<AppAbility>);

//     const abilities = this.prisma.ability.findMany({
//       where: {
//         roleId: user.roleId,
//       },
//     });

//     // if (user) {
//     //   can(Action.Manage, 'all'); // read-write access to everything
//     // } else {
//     //   can(Action.Read, 'all'); // read-only access to everything
//     // }

//     // can(Action.Update, Article, { authorId: user.id });
//     // cannot(Action.Delete, Article, { isPublished: true });

//     return build({
//       // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
//       detectSubjectType: item =>
//         item.constructor as ExtractSubjectType<Subjects>,
//     });
//   }
// }

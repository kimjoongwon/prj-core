import { $Enums } from '@coc/db';
import { Base } from '@common';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

/**
 * @Super God
 * @Site Site관리 권한
 * @Page Page관리 권한
 */
export enum Roles {
  Super,
  Educator,
  Learner,
  User,
}

registerEnumType(Roles, {
  name: 'RoleNames',
});

@ObjectType()
export class Role extends Base {
  @Field(() => Roles, { description: 'Super, Educator, Learner, User' })
  name: $Enums.Roles;

  @Field(() => [String], {
    description: '해당 권한이 접근 가능한 페이지 리스트',
  })
  accessPages: string[];
}

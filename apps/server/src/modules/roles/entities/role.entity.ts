import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

/**
 * @Super God
 * @Site Site관리 권한
 * @Page Page관리 권한
 */
export enum RoleNames {
  Super,
  Educator,
  Learner,
  User,
}

registerEnumType(RoleNames, {
  name: 'RoleNames',
});
//  유저작업공간분류 > 유저작업공간 > 유저그룹분류 > 유저그룹
//  사용자의 계정이 생성되면 최상단 위계에 소속되어야 한다.
//  사용자가 어디에 들어가려면 최상단 위계부터 선택해서 진입해야한다.
//  예를들면 본인의 분야(직장인)을 선택하고 그 다음 회사를 선택하고 그 다음 본인의 분류(인사과)가 선택되고 그 소속된 내역에 그룹이
//  형성 된다.
//  이것이 현실인데 여기서 관리자란??
//  누가 관리자가 될 것인가?
//  음.....? 만약 강사라면..? 강사도 위 처럼 유저작업공간분류 블라블라 코스를 타게 된다.
//  결과적으로 유저작업공간분류가 강사인 것이고 작업공간은 본인 헬스장인 것이고 유저그룹 분류는 관리자이고 유저그룹은 사장이 된다.
@ObjectType()
export class Role {
  @Field(() => RoleNames, { description: 'Super, Educator, Learner, User' })
  name: RoleNames;

  @Field(() => [String], {
    description: '해당 권한이 접근 가능한 페이지 리스트',
  })
  accessPages: string[];
}

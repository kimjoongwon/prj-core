import { SpaceCategoryName, SpaceGroupName } from "@cocrepo/constant";

/**
 * Space 관련 기준 데이터입니다.
 *
 * 여기서의 business key는 자유 문자열이 아니라 enum 값입니다.
 * 즉, schema/runtime/query 전반에서 같은 enum 이름을 공유한다는 전제가 있으므로
 * 기존 항목을 수정하기보다 enum과 함께 버전 관리하는 쪽에 가깝습니다.
 */

export interface SpaceCategorySeedData {
	spaceCategoryEnum: SpaceCategoryName;
	parentCategoryCode?: string;
}

// ROOT -> BRANCH 계층은 bootstrap에서 생성하는 실제 Space 트리의 뼈대가 됩니다.
export const spaceCategorySeedData: SpaceCategorySeedData[] = [
	{ spaceCategoryEnum: SpaceCategoryName.ROOT },
	{
		spaceCategoryEnum: SpaceCategoryName.BRANCH,
		parentCategoryCode: "ROOT",
	},
];

export interface SpaceGroupSeedData {
	spaceGroupEnum: SpaceGroupName;
}

// 현재는 ROOT 하나만 쓰지만, group 단위 권한/분류를 확장할 때 같은 계약을 재사용합니다.
export const spaceGroupSeedData: SpaceGroupSeedData[] = [
	{ spaceGroupEnum: SpaceGroupName.ROOT },
];

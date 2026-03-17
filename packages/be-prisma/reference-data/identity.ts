import { SpaceCategoryName, SpaceGroupName } from "@cocrepo/enum";

// ============================================================================
// Space Category 시드 데이터 (SpaceCategoryName enum 활용)
// ============================================================================

export interface SpaceCategorySeedData {
	spaceCategoryEnum: SpaceCategoryName;
	type: "Space";
	parentCategoryCode?: string;
}

export const spaceCategorySeedData: SpaceCategorySeedData[] = [
	{ spaceCategoryEnum: SpaceCategoryName.ROOT, type: "Space" },
	{
		spaceCategoryEnum: SpaceCategoryName.BRANCH,
		type: "Space",
		parentCategoryCode: "ROOT",
	},
];

// ============================================================================
// Space Group 시드 데이터 (SpaceGroupName enum 활용)
// ============================================================================

export interface SpaceGroupSeedData {
	spaceGroupEnum: SpaceGroupName;
}

export const spaceGroupSeedData: SpaceGroupSeedData[] = [
	{ spaceGroupEnum: SpaceGroupName.ROOT },
];

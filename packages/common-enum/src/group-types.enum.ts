import type { GroupTypes } from "@cocrepo/prisma/enums";

export const GroupTypesLabel: Record<GroupTypes, string> = {
	Role: "역할",
	Space: "공간",
	Asset: "에셋",
	User: "사용자",
};

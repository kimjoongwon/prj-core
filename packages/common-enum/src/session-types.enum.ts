import type { SessionTypes } from "./generated/prisma-enums";

export const SessionTypesLabel: Record<SessionTypes, string> = {
	ONE_TIME: "일회성",
	ONE_TIME_RANGE: "기간형",
	RECURRING: "반복",
};

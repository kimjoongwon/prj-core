export class PrismaClient {}

export const Prisma = {};
export const ReservationStatus = {
	CONFIRMED: "CONFIRMED",
	WAITLISTED: "WAITLISTED",
	CANCELED: "CANCELED",
} as const;
export const CoursePassStatus = {
	ACTIVE: "ACTIVE",
	SUSPENDED: "SUSPENDED",
	EXPIRED: "EXPIRED",
	CANCELED: "CANCELED",
} as const;
export const SessionTypes = {
	ONE_TIME: "ONE_TIME",
	ONE_TIME_RANGE: "ONE_TIME_RANGE",
	RECURRING: "RECURRING",
} as const;
export const RepeatCycleTypes = {
	WEEKLY: "WEEKLY",
	MONTHLY: "MONTHLY",
} as const;
export const AssetKind = {
	IMAGE: "IMAGE",
	VIDEO: "VIDEO",
	DOCUMENT: "DOCUMENT",
} as const;
export const AssetStatus = {
	UPLOADING: "UPLOADING",
	READY: "READY",
	FAILED: "FAILED",
} as const;

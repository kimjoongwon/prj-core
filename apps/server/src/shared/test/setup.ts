import "reflect-metadata";

// Mock @cocrepo/enum for BaseEnum-based enums
jest.mock("@cocrepo/enum", () => {
	// BaseEnum mock
	class BaseEnum {
		protected constructor(
			protected readonly _code: string,
			protected readonly _name: string,
		) {}

		get code(): string {
			return this._code;
		}

		get name(): string {
			return this._name;
		}

		equals(code: string): boolean {
			return this.code === code;
		}
	}

	// SpaceCategoryName mock
	class SpaceCategoryName extends BaseEnum {
		static readonly ROOT = new SpaceCategoryName("ROOT", "루트");
		static readonly BRANCH = new SpaceCategoryName("BRANCH", "지점");

		private static readonly _values = [
			SpaceCategoryName.ROOT,
			SpaceCategoryName.BRANCH,
		] as const;

		static values(): SpaceCategoryName[] {
			return [...SpaceCategoryName._values];
		}

		private constructor(code: string, name: string) {
			super(code, name);
		}
	}

	// DeleteFilter enum
	const DeleteFilter = {
		ACTIVE: "active",
		DELETED: "deleted",
	} as const;

	return {
		BaseEnum,
		SpaceCategoryName,
		DeleteFilter,
	};
});

// Mock @cocrepo/be-common to avoid Prisma ESM issues
jest.mock("@cocrepo/be-common", () => {
	// Get the actual SpaceCategoryName from the mocked @cocrepo/enum
	const { SpaceCategoryName } = jest.requireMock("@cocrepo/enum");

	const isRootSpaceCategory = (tenant: any): boolean => {
		const categoryName = tenant?.space?.spaceClassification?.category?.name;
		return categoryName === SpaceCategoryName.ROOT.name;
	};

	const canAccessAllSpaces = (tenant: any): boolean => {
		return isRootSpaceCategory(tenant);
	};

	return {
		isRootSpaceCategory,
		canAccessAllSpaces,
	};
});

// Mock @cocrepo/prisma for ESM compatibility
jest.mock("@cocrepo/prisma", () => {
	// Create mock PrismaClient
	const mockPrismaClient = jest.fn().mockImplementation(() => ({
		$connect: jest.fn(),
		$disconnect: jest.fn(),
		$transaction: jest.fn(),
		user: {
			findMany: jest.fn(),
			findUnique: jest.fn(),
			findFirst: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
			count: jest.fn(),
		},
		asset: {
			findMany: jest.fn(),
			findUnique: jest.fn(),
			findFirst: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
			count: jest.fn(),
		},
		folder: {
			findMany: jest.fn(),
			findUnique: jest.fn(),
			findFirst: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
			count: jest.fn(),
		},
		album: {
			findMany: jest.fn(),
			findUnique: jest.fn(),
			findFirst: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
			count: jest.fn(),
		},
		albumEntry: {
			findMany: jest.fn(),
			findUnique: jest.fn(),
			findFirst: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
			count: jest.fn(),
		},
		space: {
			findMany: jest.fn(),
			findUnique: jest.fn(),
			findFirst: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
			count: jest.fn(),
		},
		tenant: {
			findMany: jest.fn(),
			findUnique: jest.fn(),
			findFirst: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
			count: jest.fn(),
		},
	}));

	// Export Prisma namespace with common types
	const Prisma = {
		AssetWhereInput: {} as any,
		AssetOrderByWithRelationInput: {} as any,
		AssetUncheckedCreateInput: {} as any,
		AssetUncheckedUpdateInput: {} as any,
		FolderWhereInput: {} as any,
		FolderOrderByWithRelationInput: {} as any,
		FolderUncheckedCreateInput: {} as any,
		FolderUncheckedUpdateInput: {} as any,
		AlbumWhereInput: {} as any,
		AlbumOrderByWithRelationInput: {} as any,
		AlbumUncheckedCreateInput: {} as any,
		AlbumUncheckedUpdateInput: {} as any,
		JsonValue: {} as any,
	};

	// Asset enums
	const AssetKind = {
		IMAGE: "IMAGE",
		VIDEO: "VIDEO",
		DOCUMENT: "DOCUMENT",
	} as const;

	const AssetStatus = {
		UPLOADING: "UPLOADING",
		PROCESSING: "PROCESSING",
		READY: "READY",
		ERROR: "ERROR",
	} as const;

	const DerivativeKind = {
		THUMBNAIL: "THUMBNAIL",
		PREVIEW: "PREVIEW",
		OPTIMIZED: "OPTIMIZED",
	} as const;

	// Auth enums
	const WhitelistType = {
		EMAIL: "EMAIL",
		PHONE: "PHONE",
		DOMAIN: "DOMAIN",
	} as const;

	const AuthAuditResult = {
		SUCCESS: "SUCCESS",
		FAILURE: "FAILURE",
	} as const;

	// Template enums
	const TemplateType = {
		EMAIL: "EMAIL",
		SMS: "SMS",
		PUSH: "PUSH",
	} as const;

	// Translation enums
	const LanguageCode = {
		KO: "KO",
		EN: "EN",
		JA: "JA",
		ZH: "ZH",
	} as const;

	// Core enums
	const SMSStatus = {
		PENDING: "PENDING",
		SENT: "SENT",
		FAILED: "FAILED",
	} as const;

	const ReservationStatus = {
		PENDING: "PENDING",
		CONFIRMED: "CONFIRMED",
		CANCELLED: "CANCELLED",
		COMPLETED: "COMPLETED",
	} as const;

	const SessionTypes = {
		ONLINE: "ONLINE",
		OFFLINE: "OFFLINE",
		HYBRID: "HYBRID",
	} as const;

	const RepeatCycleTypes = {
		DAILY: "DAILY",
		WEEKLY: "WEEKLY",
		MONTHLY: "MONTHLY",
		YEARLY: "YEARLY",
	} as const;

	const SessionEndTypes = {
		DATE: "DATE",
		REPEAT: "REPEAT",
	} as const;

	const RecurringDayOfWeek = {
		SUN: "SUN",
		MON: "MON",
		TUE: "TUE",
		WED: "WED",
		THU: "THU",
		FRI: "FRI",
		SAT: "SAT",
	} as const;

	const TemplateNames = {
		VERIFICATION: "VERIFICATION",
		NOTIFICATION: "NOTIFICATION",
		RESET_PASSWORD: "RESET_PASSWORD",
	} as const;

	const QnaStatus = {
		PENDING: "PENDING",
		ANSWERED: "ANSWERED",
		CLOSED: "CLOSED",
	} as const;

	const TextTypes = {
		PLAIN: "PLAIN",
		HTML: "HTML",
		MARKDOWN: "MARKDOWN",
	} as const;

	const CategoryTypes = {
		ROOT: "ROOT",
		GENERAL: "GENERAL",
		SPECIAL: "SPECIAL",
	} as const;

	const GroupTypes = {
		PUBLIC: "PUBLIC",
		PRIVATE: "PRIVATE",
		HIDDEN: "HIDDEN",
	} as const;

	return {
		PrismaClient: mockPrismaClient,
		Prisma,
		// Asset enums
		AssetKind,
		AssetStatus,
		DerivativeKind,
		// Auth enums
		WhitelistType,
		AuthAuditResult,
		// Template enums
		TemplateType,
		// Translation enums
		LanguageCode,
		// Core enums
		SMSStatus,
		ReservationStatus,
		SessionTypes,
		RepeatCycleTypes,
		SessionEndTypes,
		RecurringDayOfWeek,
		TemplateNames,
		QnaStatus,
		TextTypes,
		CategoryTypes,
		GroupTypes,
	};
});

const MEBIBYTE = 1024 * 1024;

export const ASSET_UPLOAD_LIMITS = {
	fileSize: 25 * MEBIBYTE,
	files: 1,
	fields: 1,
	parts: 3,
	fieldNameSize: 32,
	fieldSize: 64,
	headerPairs: 16,
	fieldNestingDepth: 0,
	fieldArrayIndexLimit: 0,
} as const;

export const ASSET_UPLOAD_OPTIONS = {
	limits: ASSET_UPLOAD_LIMITS,
} as const;

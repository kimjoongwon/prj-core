// Prisma 7 호환용 JsonValue 타입
// Prisma가 JsonValue export를 제거하여 직접 정의
export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonObject
	| JsonArray;

export type JsonObject = { [key: string]: JsonValue };

export type JsonArray = JsonValue[];

// JsonValue type for Prisma 7 compatibility
// Prisma removed JsonValue from exports, so we define it ourselves
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

export type JsonObject = { [key: string]: JsonValue };

export type JsonArray = JsonValue[];

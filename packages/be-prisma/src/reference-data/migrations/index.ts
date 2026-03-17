import { initialReferenceDataMigration } from "./20260317190000_initial-reference-data";
import type { ReferenceDataMigration } from "./types";

export const referenceDataMigrations: ReferenceDataMigration[] = [
	initialReferenceDataMigration,
];

/**
 * Spaces Service Input Types
 */
export interface CreateSpaceInput {
	name?: string;
	description?: string | null;
	classificationId?: string;
}

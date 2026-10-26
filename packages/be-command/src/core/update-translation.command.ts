import type { UpdateTranslationCommandInput } from "@cocrepo/input";
export class UpdateTranslationCommand implements UpdateTranslationCommandInput {
	readonly text?: UpdateTranslationCommandInput["text"];
	readonly category?: UpdateTranslationCommandInput["category"];
	readonly isTranslated?: UpdateTranslationCommandInput["isTranslated"];

	constructor(
		readonly translationId: bigint,
		input: UpdateTranslationCommandInput,
	) {
		Object.assign(this, input);
	}
}

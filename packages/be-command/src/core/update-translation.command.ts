import type { UpdateTranslationCommandInput } from "./update-translation.input";
export class UpdateTranslationCommand {
	constructor(
		readonly translationId: string,
		readonly input: UpdateTranslationCommandInput,
	) {}
}

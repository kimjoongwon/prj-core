import type { CreateTranslationCommandInput } from "@cocrepo/input";
export class CreateTranslationCommand implements CreateTranslationCommandInput {
	readonly languageCode!: CreateTranslationCommandInput["languageCode"];
	readonly key!: CreateTranslationCommandInput["key"];
	readonly text!: CreateTranslationCommandInput["text"];
	readonly category!: CreateTranslationCommandInput["category"];
	readonly isTranslated!: CreateTranslationCommandInput["isTranslated"];

	constructor(input: CreateTranslationCommandInput) {
		Object.assign(this, input);
	}
}

import type { GetTranslationsQueryInput } from "@cocrepo/input";

export class GetTranslationsQuery implements GetTranslationsQueryInput {
	readonly languageCode?: GetTranslationsQueryInput["languageCode"];
	readonly category?: GetTranslationsQueryInput["category"];
	readonly isTranslated?: GetTranslationsQueryInput["isTranslated"];
	readonly key?: GetTranslationsQueryInput["key"];
	readonly page?: GetTranslationsQueryInput["page"];
	readonly limit?: GetTranslationsQueryInput["limit"];

	constructor(input: GetTranslationsQueryInput) {
		Object.assign(this, input);
	}
}

import type { GetTranslationsDto } from "@cocrepo/dto";

export class GetTranslationsQuery {
	constructor(readonly query: GetTranslationsDto) {}
}

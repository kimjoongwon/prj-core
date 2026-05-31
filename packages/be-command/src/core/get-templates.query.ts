import type { QueryTemplateDto } from "@cocrepo/dto";

export class GetTemplatesQuery {
	constructor(readonly query: QueryTemplateDto) {}
}

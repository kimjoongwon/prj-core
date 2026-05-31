import type { UpdateTranslationDto } from "@cocrepo/dto";

export class UpdateTranslationCommand {
	constructor(
		readonly translationId: string,
		readonly dto: UpdateTranslationDto,
	) {}
}

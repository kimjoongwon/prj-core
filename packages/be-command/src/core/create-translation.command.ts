import type { CreateTranslationDto } from "@cocrepo/dto";

export class CreateTranslationCommand {
	constructor(readonly dto: CreateTranslationDto) {}
}

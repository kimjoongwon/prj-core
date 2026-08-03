import {
	EnumFieldOptional,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator/field";
import { LanguageCode } from "@cocrepo/prisma";

export class UpdateFitnessCenterDto {
	@StringFieldOptional()
	name?: string;

	@StringFieldOptional({ nullable: true })
	label?: string | null;

	@StringFieldOptional()
	address?: string;

	@StringFieldOptional()
	phone?: string;

	@StringFieldOptional()
	email?: string;

	@UUIDFieldOptional({ nullable: true })
	imageFileId?: string | null;

	@EnumFieldOptional(() => LanguageCode)
	contentLanguageCode?: LanguageCode;
}

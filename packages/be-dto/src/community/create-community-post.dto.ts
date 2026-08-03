import { StringField, StringFieldOptional } from "@cocrepo/decorator/field";
import { CommunityPostSchema } from "@cocrepo/schema";

export class CreateCommunityPostPayloadDto extends CommunityPostSchema {
	@StringFieldOptional({
		description: "게시글 제목",
		maxLength: 80,
	})
	declare title?: string;

	@StringField({
		description: "게시글 본문",
		maxLength: 1000,
	})
	declare text: string;
}

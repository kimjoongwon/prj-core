import { String, StringOptional } from "../../decorators";

export class CommunityPostSchema {
	@StringOptional({ maxLength: 80, minLength: 1 })
	title?: string;

	@String({ maxLength: 1000, minLength: 1 })
	text: string;
}

import { StringField } from "@cocrepo/decorator/field";

/**
 * POST /api/interaction/:uid/confirm 응답
 */
export class ConsentResultDto {
	@StringField({ description: "리다이렉트 URL" })
	redirectTo!: string;
}

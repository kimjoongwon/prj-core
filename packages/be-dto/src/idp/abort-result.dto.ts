import { StringField } from "@cocrepo/decorator/field";

/**
 * POST /api/interaction/:uid/abort 응답
 */
export class AbortResultDto {
	@StringField({ description: "리다이렉트 URL" })
	redirectTo!: string;
}

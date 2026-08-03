import { NumberField, StringField } from "@cocrepo/decorator/field";

export class LoginTrendItemDto {
	@StringField({ description: "날짜 (YYYY-MM-DD)" })
	date!: string;

	@NumberField({ description: "성공 건수" })
	successCount!: number;

	@NumberField({ description: "실패 건수" })
	failureCount!: number;
}

import { AbstractSchema } from "../abstract.schema";

/** InquiryTag의 DB 필드 타입과 공통 검증입니다. */
export class InquiryTagSchema
	extends AbstractSchema
{
	inquiryTagId!: string;

	inquiryId!: bigint;

	name!: string;

	color!: string | null;
}

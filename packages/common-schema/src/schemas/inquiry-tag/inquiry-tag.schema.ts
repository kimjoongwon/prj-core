import type { InquiryTag as PrismaInquiryTag } from "@cocrepo/prisma";
import { AbstractSchema } from "../abstract.schema";

/** InquiryTag의 DB 필드 타입과 공통 검증입니다. */
export class InquiryTagSchema
	extends AbstractSchema
	implements PrismaInquiryTag
{
	inquiryTagId!: PrismaInquiryTag["inquiryTagId"];

	inquiryId!: PrismaInquiryTag["inquiryId"];

	name!: PrismaInquiryTag["name"];

	color!: PrismaInquiryTag["color"];
}

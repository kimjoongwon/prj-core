import {
	EnumField,
	StringField,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";
import {
	type PaymentReference,
	PaymentReferenceType,
	type Prisma,
} from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";

export class PaymentReferenceDto
	extends AbstractDto
	implements PaymentReference
{
	@UUIDField({ description: "결제 ID" })
	paymentId!: string;

	@UUIDField({ description: "소속 Space ID" })
	spaceId!: string;

	@StringField({ description: "서비스 코드", maxLength: 80 })
	serviceCode!: string;

	@EnumField(() => PaymentReferenceType, { description: "참조 리소스 종류" })
	referenceType!: PaymentReferenceType;

	@StringField({ description: "참조 리소스 ID", maxLength: 160 })
	referenceId!: string;

	@StringField({ description: "참조 역할", maxLength: 80 })
	role!: string;

	@StringFieldOptional({
		description: "참조 표시명",
		maxLength: 160,
		nullable: true,
	})
	label!: string | null;

	metadata!: Prisma.JsonValue | null;
}

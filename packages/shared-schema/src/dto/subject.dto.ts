import { Subject } from "@prisma/client";
import { StringField, UUIDField } from "../decorator/field";
import { AbstractDto } from "./abstract.dto";

export class SubjectDto extends AbstractDto implements Subject {
	@UUIDField()
	tenantId: string;
	@StringField()
	name: string;
}

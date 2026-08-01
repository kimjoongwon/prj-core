import {
	BooleanField,
	ClassField,
	NumberField,
	StringField,
	ULIDField,
} from "@cocrepo/decorator";
import { ActionDto } from "./action.dto";
import { SubjectSummaryDto } from "./subject.dto";

/**
 * Ability 간략 DTO (목록 조회용)
 */
export class AbilitySummaryDto {
	@ULIDField()
	id!: string;

	@StringField()
	name!: string;

	@ULIDField()
	actionId!: string;

	@ULIDField()
	subjectId!: string;

	@BooleanField()
	inverted!: boolean;

	@NumberField({ required: false })
	priority?: number; // From Policy assignment (optional)

	@ClassField(() => ActionDto, { required: false })
	action?: ActionDto;

	@ClassField(() => SubjectSummaryDto, { required: false })
	subject?: SubjectSummaryDto;
}

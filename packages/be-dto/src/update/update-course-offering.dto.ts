import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateCourseOfferingDto } from "../create";

export class UpdateCourseOfferingDto extends PartialType(
	OmitType(CreateCourseOfferingDto, ["courseId", "spaceId"]),
) {}

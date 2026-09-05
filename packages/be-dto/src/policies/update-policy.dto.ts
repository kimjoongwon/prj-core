import { StringFieldOptional } from "@cocrepo/decorator/field";
import { Policy } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdatePolicyDto extends PartialType(
	PickType(Policy, ["name"] as const),
) {
	@IsOptional()
	@StringFieldOptional()
	displayName?: string | null;

	@IsOptional()
	@StringFieldOptional()
	description?: string | null;
}

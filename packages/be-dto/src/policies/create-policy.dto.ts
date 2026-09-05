import { StringFieldOptional } from "@cocrepo/decorator/field";
import { Policy } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class CreatePolicyDto extends PickType(Policy, ["name"] as const) {
	@StringFieldOptional()
	displayName?: string | null;

	@StringFieldOptional()
	description?: string | null;
}

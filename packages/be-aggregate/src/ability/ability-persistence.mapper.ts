import type { CreateAbilityInput, UpdateAbilityInput } from "@cocrepo/input";
import type { AbilitiesRepository } from "@cocrepo/repository";

type AbilityCreateData = Parameters<AbilitiesRepository["create"]>[0];
type AbilityUpdateData = Parameters<AbilitiesRepository["updateById"]>[1];

export function toAbilityCreateData(
	input: CreateAbilityInput,
): AbilityCreateData {
	return {
		actionId: input.actionId,
		subjectId: input.subjectId,
		fields: input.fields ?? [],
		conditions: (input.conditions ?? null) as AbilityCreateData["conditions"],
		inverted: input.inverted ?? false,
		reason: input.reason ?? null,
		name: input.name,
		description: input.description ?? null,
	};
}

export function toAbilityUpdateData(
	input: UpdateAbilityInput,
): AbilityUpdateData {
	const data: AbilityUpdateData = {};

	if (input.actionId !== undefined) data.actionId = input.actionId;
	if (input.subjectId !== undefined) data.subjectId = input.subjectId;
	if (input.fields !== undefined) data.fields = input.fields;
	if (input.conditions !== undefined) {
		data.conditions = input.conditions as AbilityUpdateData["conditions"];
	}
	if (input.inverted !== undefined) data.inverted = input.inverted;
	if (input.reason !== undefined) data.reason = input.reason;
	if (input.name !== undefined) data.name = input.name;
	if (input.description !== undefined) data.description = input.description;

	return data;
}

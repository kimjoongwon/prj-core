import type { ListSpacesQueryInput } from "@cocrepo/input";

export class ListSpacesQuery implements ListSpacesQueryInput {
	readonly spaceIds?: ListSpacesQueryInput["spaceIds"];
	readonly skip?: ListSpacesQueryInput["skip"];
	readonly take?: ListSpacesQueryInput["take"];
	readonly search?: ListSpacesQueryInput["search"];
	readonly contentLanguageCode?: ListSpacesQueryInput["contentLanguageCode"];

	constructor(input?: ListSpacesQueryInput) {
		Object.assign(this, input);
	}
}

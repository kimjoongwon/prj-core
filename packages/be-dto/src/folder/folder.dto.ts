import { Folder } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types/entity-response-type";

export class FolderDto extends EntityResponseType(Folder, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"spaceSeq",
		"parentFolderSeq",
		"name",
		"path",
		"sortOrder",
		"createdBySeq",
		"parent",
		"children",
	],
	relations: { parent: () => FolderDto, children: () => FolderDto },
}) {
	declare parent?: FolderDto;
	declare children?: FolderDto[];
}

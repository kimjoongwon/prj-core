import {
	File,
	FileAssociation as FileAssociationEntity,
	Group,
} from "@prisma/client";
import { AbstractEntity } from "./abstract.entity";

export class FileAssociation extends AbstractEntity implements FileAssociationEntity {
	groupId!: string;
	fileId!: string;
	file?: File;
	group?: Group;
}

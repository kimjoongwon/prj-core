import { Injectable } from "@nestjs/common";
import { CreateFileDto, File, UpdateFileDto } from "@shared/schema";
import { FilesRepository } from "../repository/files.repository";
import { BaseService } from "./base.service";

@Injectable()
export class FilesService extends BaseService<
	CreateFileDto,
	UpdateFileDto,
	any,
	File,
	FilesRepository
> {
	constructor(readonly repository: FilesRepository) {
		super(repository);
	}
}

import { Injectable } from "@nestjs/common";
import {
  CreateFileClassificationDto,
  FileClassification,
  UpdateFileClassificationDto,
} from "@shared/schema";
import { FileClassificationsRepository } from "../repository/file-classifications.repository";
import { BaseService } from "./base.service";

@Injectable()
export class FileClassificationsService extends BaseService<
  CreateFileClassificationDto,
  UpdateFileClassificationDto,
  any,
  FileClassification,
  FileClassificationsRepository
> {
  constructor(readonly repository: FileClassificationsRepository) {
    super(repository);
  }
}

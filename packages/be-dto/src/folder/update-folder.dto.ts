import { PartialType } from "@nestjs/swagger";
import { CreateFolderDto } from "./create-folder.dto";

/**
 * 폴더 수정 DTO
 */
export class UpdateFolderDto extends PartialType(CreateFolderDto) {}

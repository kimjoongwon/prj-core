import { PartialType } from "@nestjs/swagger";
import { CreateAlbumDto } from "./create-album.dto";

/**
 * 앨범 수정 DTO
 */
export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {}

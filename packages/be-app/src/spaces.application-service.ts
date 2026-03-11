import type { CreateGroundDto, UpdateGroundDto } from "@cocrepo/dto";
import { Ground, Space } from "@cocrepo/entity";
import { SpacesService } from "@cocrepo/service";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class SpacesApplicationService {
	private readonly logger = new Logger(SpacesApplicationService.name);

	constructor(private readonly spacesService: SpacesService) {}

	async getSpaces(params?: {
		spaceIds?: string[];
		skip?: number;
		take?: number;
		search?: string;
	}): Promise<{ spaces: Space[]; total: number }> {
		this.logger.debug("공간 목록 조회");
		return this.spacesService.listSpaces(params);
	}

	async getSpaceById(spaceId: string): Promise<Space> {
		return this.spacesService.getByIdWithGround(spaceId);
	}

	async getSpaceGround(spaceId: string): Promise<Ground> {
		return this.spacesService.getGroundBySpaceId(spaceId);
	}

	async createSpace(dto: CreateGroundDto): Promise<Space> {
		return this.spacesService.createSpaceWithGround(dto);
	}

	async updateSpaceGround(
		spaceId: string,
		dto: UpdateGroundDto,
	): Promise<Space> {
		return this.spacesService.updateGroundBySpaceId(spaceId, dto);
	}

	async deleteSpace(spaceId: string): Promise<void> {
		await this.spacesService.removeSpace(spaceId);
	}
}

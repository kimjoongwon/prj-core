import type { CreateGroundDto, UpdateGroundDto } from "@cocrepo/dto";
import { Ground, Space } from "@cocrepo/entity";
import { SpacesService } from "@cocrepo/service";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class SpacesApplicationService {
	private readonly logger = new Logger(SpacesApplicationService.name);

	constructor(private readonly spacesService: SpacesService) {}

	listSpaces(params?: {
		spaceIds?: string[];
		skip?: number;
		take?: number;
		search?: string;
	}): Promise<{
		data: Space[];
		meta: {
			total: number;
			skip: number;
			take: number;
			totalPages: number;
		};
	}> {
		return this.getSpaces(params);
	}

	async getSpaces(params?: {
		spaceIds?: string[];
		skip?: number;
		take?: number;
		search?: string;
	}): Promise<{
		data: Space[];
		meta: {
			total: number;
			skip: number;
			take: number;
			totalPages: number;
		};
	}> {
		this.logger.debug("공간 목록 조회");
		const { spaces, total } = await this.spacesService.listSpaces(params);
		const skip = 0;
		const take = spaces.length;

		return {
			data: spaces,
			meta: {
				total,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(total / take) : 1,
			},
		};
	}

	getByIdWithGround(spaceId: string): Promise<Space> {
		return this.getSpaceById(spaceId);
	}

	async getSpaceById(spaceId: string): Promise<Space> {
		return this.spacesService.getByIdWithGround(spaceId);
	}

	getGroundBySpaceId(spaceId: string): Promise<Ground> {
		return this.getSpaceGround(spaceId);
	}

	async getSpaceGround(spaceId: string): Promise<Ground> {
		return this.spacesService.getGroundBySpaceId(spaceId);
	}

	createSpaceWithGround(dto: CreateGroundDto): Promise<Space> {
		return this.createSpace(dto);
	}

	async createSpace(dto: CreateGroundDto): Promise<Space> {
		return this.spacesService.createSpaceWithGround(dto);
	}

	updateGroundBySpaceId(spaceId: string, dto: UpdateGroundDto): Promise<Space> {
		return this.spacesService.updateGroundBySpaceId(spaceId, dto);
	}

	async updateSpaceGround(
		spaceId: string,
		dto: UpdateGroundDto,
	): Promise<Space> {
		return this.spacesService.updateGroundBySpaceId(spaceId, dto);
	}

	removeSpace(spaceId: string): Promise<void> {
		return this.deleteSpace(spaceId);
	}

	async deleteSpace(spaceId: string): Promise<void> {
		await this.spacesService.removeSpace(spaceId);
	}
}

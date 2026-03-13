import type { CreateGroundDto, UpdateGroundDto } from "@cocrepo/dto";
import { Ground, Space } from "@cocrepo/entity";
import { SpaceService } from "@cocrepo/service";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class SpaceFacade {
	private readonly logger = new Logger(SpaceFacade.name);

	constructor(private readonly spaceService: SpaceService) {}

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
		const { spaces, total } = await this.spaceService.listSpaces(params);
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

	getSpaceById(spaceId: string): Promise<Space> {
		return this.spaceService.getByIdWithGround(spaceId);
	}

	getGroundBySpaceId(spaceId: string): Promise<Ground> {
		return this.getSpaceGround(spaceId);
	}

	getSpaceGround(spaceId: string): Promise<Ground> {
		return this.spaceService.getGroundBySpaceId(spaceId);
	}

	createSpaceWithGround(dto: CreateGroundDto): Promise<Space> {
		return this.createSpace(dto);
	}

	createSpace(dto: CreateGroundDto): Promise<Space> {
		return this.spaceService.createSpaceWithGround(dto);
	}

	updateGroundBySpaceId(spaceId: string, dto: UpdateGroundDto): Promise<Space> {
		return this.spaceService.updateGroundBySpaceId(spaceId, dto);
	}

	updateSpaceGround(spaceId: string, dto: UpdateGroundDto): Promise<Space> {
		return this.spaceService.updateGroundBySpaceId(spaceId, dto);
	}

	removeSpace(spaceId: string): Promise<void> {
		return this.deleteSpace(spaceId);
	}

	async deleteSpace(spaceId: string): Promise<void> {
		await this.spaceService.removeSpace(spaceId);
	}
}

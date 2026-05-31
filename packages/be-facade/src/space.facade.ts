import { SpaceAggregateRoot } from "@cocrepo/aggregate";
import type { CreateGroundDto, UpdateGroundDto } from "@cocrepo/dto";
import { Ground, Space } from "@cocrepo/entity";
import type { LanguageCode } from "@cocrepo/prisma";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import type { OffsetPaginatedResponse } from "@cocrepo/type";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class SpaceFacade {
	private readonly logger = new Logger(SpaceFacade.name);

	constructor(private readonly spaceService: SpaceAggregateRoot) {}

	listSpaces(params?: {
		spaceIds?: string[];
		skip?: number;
		take?: number;
		search?: string;
		contentLanguageCode?: LanguageCode;
	}): Promise<OffsetPaginatedResponse<Space[]>> {
		return this.getSpaces(params);
	}

	async getSpaces(params?: {
		spaceIds?: string[];
		skip?: number;
		take?: number;
		search?: string;
		contentLanguageCode?: LanguageCode;
	}): Promise<OffsetPaginatedResponse<Space[]>> {
		this.logger.debug("공간 목록 조회");
		const spaceResult = await this.spaceService.listSpaces(params);
		const skip = 0;
		const take = spaceResult.spaces.length;

		return buildOffsetPaginatedResponse(
			spaceResult.spaces,
			spaceResult.total,
			skip,
			take,
		);
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
}

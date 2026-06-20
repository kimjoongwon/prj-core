import { RoutineAggregate } from "@cocrepo/aggregate";
import {
	CreateRoutineDto,
	GetRoutinesQueryDto,
	SpaceScope,
	UpdateRoutineDto,
} from "@cocrepo/dto";
import { Routine } from "@cocrepo/entity";
import { AuthContext } from "@cocrepo/service";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import type { OffsetPaginatedResponse } from "@cocrepo/type";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class RoutineFacade {
	constructor(
		private readonly routinesService: RoutineAggregate,
		private readonly authContext: AuthContext,
	) {}

	findRoutines(
		query: GetRoutinesQueryDto,
	): Promise<OffsetPaginatedResponse<Routine[]>> {
		return this.getRoutines(query);
	}

	async getRoutines(
		query: GetRoutinesQueryDto,
	): Promise<OffsetPaginatedResponse<Routine[]>> {
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		const spaceScope = query.spaceScope ?? SpaceScope.CURRENT;
		const routineResult = await this.routinesService.findRoutines({
			spaceScope,
			skip,
			take,
			search: query.search,
			contentLanguageCode: query.contentLanguageCode,
		});

		return buildOffsetPaginatedResponse(
			routineResult.routines,
			routineResult.total,
			skip,
			take,
		);
	}

	findRoutineById(
		routineId: string,
		_spaceScope?: SpaceScope,
	): Promise<Routine> {
		return this.getRoutine(routineId);
	}

	getRoutine(routineId: string): Promise<Routine> {
		return this.routinesService.findRoutineById(routineId, SpaceScope.CURRENT);
	}

	async createRoutine(dto: CreateRoutineDto): Promise<Routine> {
		const userId = this.authContext.user?.id;
		if (!userId) {
			throw new UnauthorizedException("로그인이 필요합니다");
		}

		return this.routinesService.createRoutine(dto, userId);
	}

	updateRoutine(routineId: string, dto: UpdateRoutineDto): Promise<Routine> {
		return this.routinesService.updateRoutine(routineId, dto);
	}

	removeRoutine(routineId: string): Promise<void> {
		return this.deleteRoutine(routineId);
	}

	deleteRoutine(routineId: string): Promise<void> {
		return this.routinesService.removeRoutine(routineId);
	}
}

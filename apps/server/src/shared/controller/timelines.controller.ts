import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
	type CreateTimelineDto,
	PageMetaDto,
	type QueryTimelineDto,
	ResponseEntity,
	TimelineDto,
	type UpdateTimelineDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { ApiResponseEntity, Auth } from "../decorator";
import { TimelinesService } from "../service/resource/timelines.service";

@ApiTags("TIMELINE")
@Controller()
export class TimelinesController {
	constructor(private readonly service: TimelinesService) {}

	@Post()
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TimelineDto, HttpStatus.OK)
	async createTimeline(@Body() createTimelineDto: CreateTimelineDto) {
		const timeline = await this.service.create(createTimelineDto);

		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(TimelineDto, timeline),
		);
	}

	@Get(":timelineId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TimelineDto, HttpStatus.OK)
	async getTimeline(@Param("timelineId") timelineId: string) {
		const timeline = await this.service.getById(timelineId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(TimelineDto, timeline),
		);
	}

	@Patch("removedAt")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TimelineDto, HttpStatus.OK)
	async removeTimelines(@Body() timelineIds: string[]) {
		// Note: updateMany is discontinued, this endpoint may need to be updated to handle individual calls
		const promises = timelineIds.map((id) => this.service.removeById(id));
		const results = await Promise.all(promises);
		const timelines = { count: results.length };
		return new ResponseEntity(HttpStatus.OK, "성공", timelines.count);
	}

	@Patch(":timelineId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TimelineDto, HttpStatus.OK)
	async updateTimeline(
		@Param("timelineId") timelineId: string,
		@Body() updateTimelineDto: UpdateTimelineDto,
	) {
		const timeline = await this.service.updateById(
			timelineId,
			updateTimelineDto as any,
		);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(TimelineDto, timeline),
		);
	}

	@Patch(":timelineId/removedAt")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TimelineDto, HttpStatus.OK)
	async removeTimeline(@Param("timelineId") timelineId: string) {
		const timeline = await this.service.removeById(timelineId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(TimelineDto, timeline),
		);
	}

	@Delete(":timelineId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TimelineDto, HttpStatus.OK)
	async deleteTimeline(@Param("timelineId") timelineId: string) {
		const timeline = await this.service.deleteById(timelineId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(TimelineDto, timeline),
		);
	}

	@Get()
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TimelineDto, HttpStatus.OK, { isArray: true })
	async getTimelinesByQuery(@Query() query: QueryTimelineDto) {
		const { count, timelines } = await this.service.getManyByQuery(query);
		return new ResponseEntity(
			HttpStatus.OK,
			"success",
			timelines.map((timeline) => timeline?.toDto?.() ?? timeline),
			new PageMetaDto(query.skip, query.take, count),
		);
	}
}

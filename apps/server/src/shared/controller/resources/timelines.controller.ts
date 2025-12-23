import { ApiResponseEntity } from "@cocrepo/decorator";
import {
	type CreateTimelineDto,
	PageMetaDto,
	type QueryTimelineDto,
	TimelineDto,
	type UpdateTimelineDto,
} from "@cocrepo/dto";
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
import { TimelinesService } from "../../service/resources/timelines.service";
import { wrapResponse } from "../../util/response.util";

@ApiTags("TIMELINE")
@Controller()
export class TimelinesController {
	constructor(private readonly service: TimelinesService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TimelineDto, HttpStatus.OK)
	async createTimeline(@Body() createTimelineDto: CreateTimelineDto) {
		const timeline = await this.service.create(createTimelineDto);

		return timeline;
	}

	@Get(":timelineId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TimelineDto, HttpStatus.OK)
	async getTimeline(@Param("timelineId") timelineId: string) {
		const timeline = await this.service.getById(timelineId);
		return timeline;
	}

	@Patch("removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TimelineDto, HttpStatus.OK)
	async removeTimelines(@Body() timelineIds: string[]) {
		// Note: updateMany is discontinued, this endpoint may need to be updated to handle individual calls
		const promises = timelineIds.map((id) => this.service.removeById(id));
		const results = await Promise.all(promises);
		const timelines = { count: results.length };
		return timelines.count;
	}

	@Patch(":timelineId")
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
		return timeline;
	}

	@Patch(":timelineId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TimelineDto, HttpStatus.OK)
	async removeTimeline(@Param("timelineId") timelineId: string) {
		const timeline = await this.service.removeById(timelineId);
		return timeline;
	}

	@Delete(":timelineId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TimelineDto, HttpStatus.OK)
	async deleteTimeline(@Param("timelineId") timelineId: string) {
		const timeline = await this.service.deleteById(timelineId);
		return timeline;
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(TimelineDto, HttpStatus.OK, { isArray: true })
	async getTimelinesByQuery(@Query() query: QueryTimelineDto) {
		const { count, timelines } = await this.service.getManyByQuery(query);
		return wrapResponse(timelines, {
			message: "success",
			meta: new PageMetaDto(query.skip, query.take, count),
		});
	}
}

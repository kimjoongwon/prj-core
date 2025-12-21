import { Public } from "@cocrepo/decorator";
import { ApiResponseEntity } from "@cocrepo/decorator";
import {
	type CreateGroupDto,
	GroupDto,
	type QueryGroupDto,
	type UpdateGroupDto,
} from "@cocrepo/dto";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import { ResponseMessage } from "../../decorator/response-message.decorator";
import { GroupsService } from "../../service";
import { wrapResponse } from "../../util/response.util";

@ApiTags("GROUPS")
@Controller()
export class GroupsController {
	constructor(private readonly groupService: GroupsService) {}

	@ApiResponse({
		status: 201,
		description: "The record has been successfully created.",
		type: GroupDto,
	})
	@Post()
	createGroup(@Body() createGroupDto: CreateGroupDto) {
		return this.groupService.create(createGroupDto);
	}

	@Public()
	@ApiResponseEntity(GroupDto, HttpStatus.OK, { isArray: true })
	@Get()
	@ResponseMessage("그룹 페이지 데이터 리턴 성공")
	async getGroupsByQuery(@Query() query: QueryGroupDto) {
		const { totalCount, groups } =
			await this.groupService.getManyByQuery(query);

		return wrapResponse(
			groups.map((group) => group?.toDto?.() ?? group),
			{
				message: "그룹 페이지 데이터 리턴 성공",
				meta: query.toPageMetaDto(totalCount),
			},
		);
	}

	@ApiResponseEntity(GroupDto, HttpStatus.OK)
	@Get(":groupId")
	@ResponseMessage("그룹 데이터 리턴 성공")
	async getGroupById(@Param("groupId") groupId: string) {
		const group = await this.groupService.getById(groupId);

		return group ? plainToInstance(GroupDto, group) : null;
	}

	@ApiResponseEntity(GroupDto, HttpStatus.OK)
	@Patch(":groupId")
	@ResponseMessage("그룹 데이터 업데이트 성공")
	async updateGroupById(
		@Param("groupId") groupId: string,
		@Body() updateGroupDto: UpdateGroupDto,
	) {
		const group = await this.groupService.updateById(groupId, updateGroupDto);
		return plainToInstance(GroupDto, group);
	}

	@ApiResponseEntity(Number, HttpStatus.OK)
	@Patch(":groupIds")
	@ResponseMessage("그룹 데이터 제거 성공")
	async removeGroups(@Param("groupIds") ids: string[]) {
		// Note: removeMany is discontinued, this endpoint may need to be updated to handle individual calls
		const promises = ids.map((id) => this.groupService.removeById(id));
		const results = await Promise.all(promises);
		const groups = { count: results.length };
		return groups.count;
	}

	@ApiResponseEntity(Number, HttpStatus.OK)
	@Delete(":groupId")
	@ResponseMessage("그룹 데이터 삭제 성공")
	async deleteGroup(@Param("groupId") groupId: string) {
		const group = await this.groupService.deleteById(groupId);
		return plainToInstance(GroupDto, group);
	}
}

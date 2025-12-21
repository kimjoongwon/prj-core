import { ApiResponseEntity } from "@cocrepo/decorator";
import {
	CreateUserDto,
	QueryUserDto,
	UpdateUserDto,
	UserDto,
} from "@cocrepo/dto";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Logger,
	Param,
	Patch,
	Post,
	Query,
	Req,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import { Request } from "express";
import { UsersService } from "../../service/resources/users.service";
import { wrapResponse } from "../../util/response.util";

@ApiTags("USERS")
@Controller()
export class UsersController {
	private readonly logger = new Logger(UsersController.name);

	constructor(private readonly service: UsersService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserDto, HttpStatus.OK)
	async createUser(@Body() createUserDto: CreateUserDto) {
		const user = await this.service.create({
			data: createUserDto,
		});
		return plainToInstance(UserDto, user);
	}

	@Get(":userId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserDto, HttpStatus.OK)
	async getUser(@Param("userId") userId: string) {
		const user = await this.service.getById(userId);
		return plainToInstance(UserDto, user);
	}

	@Patch("removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserDto, HttpStatus.OK)
	async removeUsers(@Body() userIds: string[]) {
		// Note: removeMany is discontinued, using individual calls
		const promises = userIds.map((id) => this.service.removeById(id));
		const results = await Promise.all(promises);
		const users = { count: results.length };
		return users.count;
	}

	@Patch(":userId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserDto, HttpStatus.OK)
	async updateUser(
		@Param("userId") userId: string,
		@Body() updateUserDto: UpdateUserDto,
	) {
		const user = await this.service.updateById(userId, updateUserDto);
		return plainToInstance(UserDto, user);
	}

	@Patch(":userId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserDto, HttpStatus.OK)
	async removeUser(@Param("userId") userId: string) {
		const user = await this.service.removeById(userId);
		return plainToInstance(UserDto, user);
	}

	@Delete(":userId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserDto, HttpStatus.OK)
	async deleteUser(@Param("userId") userId: string) {
		const user = await this.service.deleteById(userId);
		return plainToInstance(UserDto, user);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserDto, HttpStatus.OK, { isArray: true })
	async getUsersByQuery(@Query() query: QueryUserDto, @Req() req: Request) {
		try {
			// 인증 정보 로깅
			const authToken = req.cookies?.accessToken || req.headers?.authorization;
			this.logger.log(`Auth token present: ${!!authToken}`);
			this.logger.log(`Request user: ${JSON.stringify(req.user)}`);
			this.logger.log(`Request headers: ${JSON.stringify(req.headers)}`);
			this.logger.log(`Request cookies: ${JSON.stringify(req.cookies)}`);

			const { count, users } = await this.service.getManyByQuery(query);

			this.logger.log(
				`Successfully retrieved ${users.length} users, total count: ${count}`,
			);

			return wrapResponse(
				users.map((user) => plainToInstance(UserDto, user)),
				{
					message: "success",
					meta: query.toPageMetaDto(count),
				},
			);
		} catch (error) {
			this.logger.error(
				`Error in getUsersByQuery: ${error instanceof Error ? error.message : String(error)}`,
				error instanceof Error ? error.stack : "",
			);
			throw error;
		}
	}
}

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
import {
	CreateUserDto,
	QueryUserDto,
	ResponseEntity,
	UpdateUserDto,
	UserDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { Request } from "express";
import { ApiResponseEntity, Auth } from "../decorator";
import { UsersService } from "../service/users.service";

@ApiTags("USERS")
@Controller()
export class UsersController {
	private readonly logger = new Logger(UsersController.name);

	constructor(private readonly service: UsersService) {}

	@Post()
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserDto, HttpStatus.OK)
	async createUser(@Body() createUserDto: CreateUserDto) {
		const user = await this.service.create({
			data: createUserDto,
		});
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(UserDto, user),
		);
	}

	@Get(":userId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserDto, HttpStatus.OK)
	async getUser(@Param("userId") userId: string) {
		const user = await this.service.getUnique({
			where: { id: userId },
			include: { tenants: true },
		});
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(UserDto, user),
		);
	}

	@Patch("removedAt")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserDto, HttpStatus.OK)
	async removeUsers(@Body() userIds: string[]) {
		const users = await this.service.removeMany(userIds);
		return new ResponseEntity(HttpStatus.OK, "성공", users.count);
	}

	@Patch(":userId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserDto, HttpStatus.OK)
	async updateUser(
		@Param("userId") userId: string,
		@Body() updateUserDto: UpdateUserDto,
	) {
		const user = await this.service.update({
			where: { id: userId },
			data: updateUserDto,
		});
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(UserDto, user),
		);
	}

	@Patch(":userId/removedAt")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserDto, HttpStatus.OK)
	async removeUser(@Param("userId") userId: string) {
		const user = await this.service.remove(userId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(UserDto, user),
		);
	}

	@Delete(":userId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(UserDto, HttpStatus.OK)
	async deleteUser(@Param("userId") userId: string) {
		const user = await this.service.delete({ where: { id: userId } });
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(UserDto, user),
		);
	}

	@Get()
	@Auth()
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

			return new ResponseEntity(
				HttpStatus.OK,
				"success",
				users.map((user) => user?.toDto?.() ?? user),
				query.toPageMetaDto(count),
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

import { SpaceContext } from "@cocrepo/context";
import { UsersController } from "@cocrepo/controller";
import { UsersRepository } from "@cocrepo/repository";
import {
	AuthCacheService,
	UserService,
} from "@cocrepo/service";
import { UserCommandHandlers, UserQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	providers: [
		UserService,
		UsersRepository,
		SpaceContext,
		AuthCacheService,
		...UserCommandHandlers,
		...UserQueryHandlers,
	],
	controllers: [UsersController],
	exports: [UserService, AuthCacheService],
})
export class UsersModule {}

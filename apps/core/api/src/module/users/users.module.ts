import { UsersRepository } from "@cocrepo/repository";
import { AuthCacheService, SpaceContext, UserService } from "@cocrepo/service";
import { UserCommandHandlers, UserQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UsersController } from "@cocrepo/controller";

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

import { SpaceContext } from "@cocrepo/service";
import { UsersRepository } from "@cocrepo/repository";
import { AuthCacheService, UsersService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";

@Module({
	providers: [UsersService, UsersRepository, SpaceContext, AuthCacheService],
	controllers: [UsersController],
	exports: [UsersService],
})
export class UsersModule {}

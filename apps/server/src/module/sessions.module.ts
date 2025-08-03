import { Module } from "@nestjs/common";
import {
	SessionsController,
	SessionsRepository,
	SessionsService,
} from "@shared";

@Module({
	controllers: [SessionsController],
	providers: [SessionsService, SessionsRepository],
})
export class SessionsModule {}

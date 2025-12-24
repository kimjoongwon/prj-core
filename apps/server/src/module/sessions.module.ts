import { SessionsRepository } from "@cocrepo/repository";
import { SessionsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { SessionsController } from "@shared";

@Module({
	controllers: [SessionsController],
	providers: [SessionsService, SessionsRepository],
})
export class SessionsModule {}

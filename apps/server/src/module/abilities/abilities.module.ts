import { AbilitiesRepository, UsersRepository } from "@cocrepo/repository";
import { AbilitiesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { AbilitiesController } from "./abilities.controller";

@Module({
	controllers: [AbilitiesController],
	providers: [AbilitiesService, AbilitiesRepository, UsersRepository],
})
export class AbilitiesModule {}

import { TenantsRepository } from "@cocrepo/repository";
import { TenantsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { TenantsController } from "@shared";

@Module({
	controllers: [TenantsController],
	providers: [TenantsService, TenantsRepository],
})
export class TenantsModule {}

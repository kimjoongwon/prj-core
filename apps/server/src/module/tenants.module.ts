import { Module } from "@nestjs/common";
import { TenantsController, TenantsRepository, TenantsService } from "@shared";

@Module({
	controllers: [TenantsController],
	providers: [TenantsService, TenantsRepository],
})
export class TenantsModule {}

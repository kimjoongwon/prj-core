import { PolicyFacade } from "@cocrepo/facade";
import {
	AbilitiesRepository,
	PoliciesRepository,
	PolicyAbilitiesRepository,
	RolePoliciesRepository,
	UserPoliciesRepository,
} from "@cocrepo/repository";
import { PolicyService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { PoliciesController } from "./policies.controller";

@Module({
	controllers: [PoliciesController],
	providers: [
		PolicyFacade,
		PolicyService,
		PoliciesRepository,
		PolicyAbilitiesRepository,
		AbilitiesRepository,
		RolePoliciesRepository,
		UserPoliciesRepository,
		SpaceContext,
	],
	exports: [PolicyFacade],
})
export class PoliciesModule {}

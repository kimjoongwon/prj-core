import { GetPasswordPolicyQuery } from "@cocrepo/command";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import {
	IDP_PASSWORD_RESET_SERVICE,
	type PasswordResetPort,
} from "./idp.ports";

@QueryHandler(GetPasswordPolicyQuery)
export class GetPasswordPolicyUseCase
	implements IQueryHandler<GetPasswordPolicyQuery>
{
	constructor(
		@Inject(IDP_PASSWORD_RESET_SERVICE)
		private readonly passwordResetService: PasswordResetPort,
	) {}

	execute() {
		return this.passwordResetService.getPasswordPolicy();
	}
}

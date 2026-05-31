import { ValidateResetTokenQuery } from "@cocrepo/command";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import {
	IDP_PASSWORD_RESET_SERVICE,
	type PasswordResetPort,
} from "./idp.ports";

@QueryHandler(ValidateResetTokenQuery)
export class ValidateResetTokenUseCase
	implements IQueryHandler<ValidateResetTokenQuery>
{
	constructor(
		@Inject(IDP_PASSWORD_RESET_SERVICE)
		private readonly passwordResetService: PasswordResetPort,
	) {}

	execute(query: ValidateResetTokenQuery) {
		return this.passwordResetService.validateToken(query.token);
	}
}

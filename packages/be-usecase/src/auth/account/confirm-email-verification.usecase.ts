import {
	EmailVerificationAggregate,
	OidcClientAggregate,
	RoleAggregate,
	SpaceAggregate,
} from "@cocrepo/aggregate";
import { ConfirmEmailVerificationCommand } from "@cocrepo/command";
import { DEFAULT_OIDC_CLIENT_ID } from "@cocrepo/constant";
import { UserService } from "@cocrepo/service";
import { BadRequestException, Logger } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { buildLoginRedirectUrl } from "../oidc/build-login-redirect-url";
import { getClientLoginUrl } from "../oidc/get-client-login-url";
import { createUserForVerifiedSignUp } from "./create-user-for-verified-sign-up";

@CommandHandler(ConfirmEmailVerificationCommand)
export class ConfirmEmailVerificationUseCase {
	private readonly logger = new Logger(ConfirmEmailVerificationUseCase.name);

	constructor(
		private readonly emailVerificationService: EmailVerificationAggregate,
		private readonly usersService: UserService,
		private readonly rolesService: RoleAggregate,
		private readonly spacesService: SpaceAggregate,
		private readonly oidcClientService: OidcClientAggregate,
	) {}

	async execute(command: ConfirmEmailVerificationCommand) {
		try {
			const verification =
				await this.emailVerificationService.consumePendingByRawToken(
					command.token,
				);
			const existingUser = await this.usersService.findUserForAuth(
				verification.email,
			);
			if (existingUser) {
				throw new BadRequestException("EMAIL_ALREADY_EXISTS");
			}

			const user = await createUserForVerifiedSignUp({
				usersService: this.usersService,
				rolesService: this.rolesService,
				spacesService: this.spacesService,
				logger: this.logger,
				name: verification.name,
				nickname: verification.nickname,
				phone: verification.phone,
				address: verification.address,
				spaceId: verification.spaceId,
				email: verification.email,
				passwordHash: verification.passwordHash,
			});
			await this.emailVerificationService.markVerified(
				verification.id,
				user.id,
			);

			const loginUrl = await getClientLoginUrl(
				this.oidcClientService,
				DEFAULT_OIDC_CLIENT_ID,
			);
			return loginUrl ?? "/admin/auth/login";
		} catch (error) {
			const loginUrl = await getClientLoginUrl(
				this.oidcClientService,
				DEFAULT_OIDC_CLIENT_ID,
			);
			const errorMessage =
				error instanceof Error ? error.message : "EMAIL_VERIFICATION_FAILED";
			return buildLoginRedirectUrl(loginUrl, errorMessage);
		}
	}
}

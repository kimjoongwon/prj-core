import { ForceResetPasswordCommand } from "@cocrepo/command";
import {
	EmailService,
	TokenStorageService,
	UserService,
} from "@cocrepo/service";
import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(ForceResetPasswordCommand)
export class ForceResetPasswordUseCase {
	constructor(
		private readonly usersService: UserService,
		private readonly emailService: EmailService,
		private readonly tokenStorageService: TokenStorageService,
	) {}

	async execute(command: ForceResetPasswordCommand): Promise<boolean> {
		const user = await this.usersService.getByIdWithTenants(command.userId);
		if (!user?.userId) {
			throw new UnauthorizedException("사용자 공개 식별자를 찾을 수 없습니다");
		}
		const result = await this.usersService.forceResetPassword(command.userId);
		await this.emailService.sendTemporaryPasswordEmail(
			result.email,
			result.temporaryPassword,
		);
		await this.tokenStorageService.deleteRefreshToken(user.userId);
		return true;
	}
}

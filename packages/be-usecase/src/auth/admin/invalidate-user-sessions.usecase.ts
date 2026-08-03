import { InvalidateUserSessionsCommand } from "@cocrepo/command";
import {
	AuthCacheService,
	TokenStorageService,
	UserService,
} from "@cocrepo/service";
import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(InvalidateUserSessionsCommand)
export class InvalidateUserSessionsUseCase {
	constructor(
		private readonly tokenStorageService: TokenStorageService,
		private readonly authCacheService: AuthCacheService,
		private readonly usersService: UserService,
	) {}

	async execute(command: InvalidateUserSessionsCommand): Promise<boolean> {
		const user = await this.usersService.getByIdWithTenants(command.userId);
		if (!user?.userId) {
			throw new UnauthorizedException("사용자 공개 식별자를 찾을 수 없습니다");
		}

		await this.tokenStorageService.deleteRefreshToken(user.userId);
		await this.authCacheService.invalidate(user.userId);
		return true;
	}
}

import { InvalidateUserSessionsCommand } from "@cocrepo/command";
import { AuthCacheService, TokenStorageService } from "@cocrepo/service";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(InvalidateUserSessionsCommand)
export class InvalidateUserSessionsUseCase {
	constructor(
		private readonly tokenStorageService: TokenStorageService,
		private readonly authCacheService: AuthCacheService,
	) {}

	async execute(command: InvalidateUserSessionsCommand): Promise<boolean> {
		await this.tokenStorageService.deleteRefreshToken(command.userId);
		await this.authCacheService.invalidate(command.userId);
		return true;
	}
}

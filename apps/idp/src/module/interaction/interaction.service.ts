import { Injectable, Logger } from "@nestjs/common";
import { UsersService } from "@cocrepo/service";
import { PlainPassword, HashedPassword } from "@cocrepo/vo";

@Injectable()
export class InteractionService {
	private readonly logger = new Logger(InteractionService.name);

	constructor(private readonly usersService: UsersService) {}

	/**
	 * 사용자 인증 (이메일/비밀번호)
	 * @returns 인증 성공 시 User, 실패 시 null
	 */
	async validateUser(email: string, password: string) {
		this.logger.debug(`Login attempt: ${email}`);

		const user = await this.usersService.findUserForAuth(email);

		if (!user) {
			this.logger.debug(`User not found: ${email}`);
			return null;
		}

		try {
			const plainPassword = PlainPassword.create(password);
			const hashedPassword = HashedPassword.fromHash(user.password);

			const isValid = await hashedPassword.compare(plainPassword);

			if (!isValid) {
				this.logger.debug(`Invalid password for: ${email}`);
				return null;
			}

			this.logger.debug(`Login successful: ${email}`);
			return user;
		} catch (error) {
			// PlainPassword validation failed (too short, etc.)
			this.logger.debug(`Password validation error: ${error}`);
			return null;
		}
	}
}

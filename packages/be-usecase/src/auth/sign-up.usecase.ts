import { EmailVerificationAggregate, SpaceAggregate } from "@cocrepo/aggregate";
import { SignUpCommand } from "@cocrepo/command";
import { UserService } from "@cocrepo/service";
import { Email, HashedPassword, Phone, PlainPassword } from "@cocrepo/vo";
import { BadRequestException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { getSignUpSpaceOrThrow } from "./auth-account.support";

@CommandHandler(SignUpCommand)
export class SignUpUseCase {
	constructor(
		private readonly usersService: UserService,
		private readonly spacesService: SpaceAggregate,
		private readonly emailVerificationService: EmailVerificationAggregate,
	) {}

	async execute(command: SignUpCommand) {
		const input = command.input;
		const email = Email.create(input.email);
		const phone = Phone.create(input.phone ?? "");
		const existingUser = await this.usersService.findUserForAuth(email.value);
		if (existingUser) {
			throw new BadRequestException("EMAIL_ALREADY_EXISTS");
		}
		await getSignUpSpaceOrThrow(this.spacesService, input.spaceId);

		const plainPassword = PlainPassword.create(input.password);
		const hashedPassword = await HashedPassword.fromPlain(plainPassword);

		return this.emailVerificationService.requestVerification({
			name: input.name,
			email: email.value,
			phone: phone.normalized,
			address: input.address,
			spaceId: input.spaceId,
			passwordHash: hashedPassword.value,
			nickname: input.nickname || input.name,
		});
	}
}

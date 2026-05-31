import {
	EmailVerificationAggregateRoot,
	SpaceAggregateRoot,
} from "@cocrepo/aggregate";
import { SignUpCommand } from "@cocrepo/command";
import { UserService } from "@cocrepo/service";
import { Email, HashedPassword, Phone, PlainPassword } from "@cocrepo/vo";
import { BadRequestException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { getSignUpSpaceOrThrow } from "./auth-account.support";

@CommandHandler(SignUpCommand)
export class SignUpUseCase implements ICommandHandler<SignUpCommand> {
	constructor(
		private readonly usersService: UserService,
		private readonly spacesService: SpaceAggregateRoot,
		private readonly emailVerificationService: EmailVerificationAggregateRoot,
	) {}

	async execute(command: SignUpCommand) {
		const signUpDto = command.signUpDto;
		const email = Email.create(signUpDto.email);
		const phone = Phone.create(signUpDto.phone ?? "");
		const existingUser = await this.usersService.findUserForAuth(email.value);
		if (existingUser) {
			throw new BadRequestException("EMAIL_ALREADY_EXISTS");
		}
		await getSignUpSpaceOrThrow(this.spacesService, signUpDto.spaceId);

		const plainPassword = PlainPassword.create(signUpDto.password);
		const hashedPassword = await HashedPassword.fromPlain(plainPassword);

		return this.emailVerificationService.requestVerification({
			name: signUpDto.name,
			email: email.value,
			phone: phone.normalized,
			address: signUpDto.address,
			spaceId: signUpDto.spaceId,
			passwordHash: hashedPassword.value,
			nickname: signUpDto.nickname || signUpDto.name,
		});
	}
}

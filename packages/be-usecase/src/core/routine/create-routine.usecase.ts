import { RoutineAggregate } from "@cocrepo/aggregate";
import { CreateRoutineCommand } from "@cocrepo/command";
import { AuthContext } from "@cocrepo/service";
import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateRoutineCommand)
export class CreateRoutineUseCase {
	constructor(
		private readonly routinesService: RoutineAggregate,
		private readonly authContext: AuthContext,
	) {}

	execute(command: CreateRoutineCommand): Promise<unknown> {
		const userId = this.authContext.user?.id;
		if (!userId) {
			throw new UnauthorizedException("로그인이 필요합니다");
		}
		return this.routinesService.createRoutine(command.input, userId);
	}
}

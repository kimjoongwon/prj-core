import { RoutineAggregateRoot } from "@cocrepo/aggregate";
import { CreateRoutineCommand } from "@cocrepo/command";
import { AuthContext } from "@cocrepo/service";
import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateRoutineCommand)
export class CreateRoutineUseCase
	implements ICommandHandler<CreateRoutineCommand>
{
	constructor(
		private readonly routinesService: RoutineAggregateRoot,
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

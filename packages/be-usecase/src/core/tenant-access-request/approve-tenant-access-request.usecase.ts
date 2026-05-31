import { TenantAccessRequestAggregateRoot } from "@cocrepo/aggregate";
import { ApproveTenantAccessRequestCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(ApproveTenantAccessRequestCommand)
export class ApproveTenantAccessRequestUseCase
	implements ICommandHandler<ApproveTenantAccessRequestCommand>
{
	constructor(
		private readonly tenantAccessRequestService: TenantAccessRequestAggregateRoot,
	) {}

	execute(command: ApproveTenantAccessRequestCommand): Promise<unknown> {
		return this.tenantAccessRequestService.approve({
			tenantAccessRequestId: command.tenantAccessRequestId,
			reviewerId: command.reviewerId,
			reviewComment: command.dto.reviewComment,
		});
	}
}

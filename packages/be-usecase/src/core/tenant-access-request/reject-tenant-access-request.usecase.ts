import { TenantAccessRequestAggregateRoot } from "@cocrepo/aggregate";
import { RejectTenantAccessRequestCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(RejectTenantAccessRequestCommand)
export class RejectTenantAccessRequestUseCase
	implements ICommandHandler<RejectTenantAccessRequestCommand>
{
	constructor(
		private readonly tenantAccessRequestService: TenantAccessRequestAggregateRoot,
	) {}

	execute(command: RejectTenantAccessRequestCommand): Promise<unknown> {
		return this.tenantAccessRequestService.reject({
			tenantAccessRequestId: command.tenantAccessRequestId,
			reviewerId: command.reviewerId,
			reviewComment: command.dto.reviewComment,
		});
	}
}

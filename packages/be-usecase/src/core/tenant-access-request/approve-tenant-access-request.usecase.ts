import { TenantAccessRequestAggregate } from "@cocrepo/aggregate";
import { ApproveTenantAccessRequestCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(ApproveTenantAccessRequestCommand)
export class ApproveTenantAccessRequestUseCase {
	constructor(
		private readonly tenantAccessRequestService: TenantAccessRequestAggregate,
	) {}

	execute(command: ApproveTenantAccessRequestCommand): Promise<unknown> {
		return this.tenantAccessRequestService.approve({
			tenantAccessRequestId: command.tenantAccessRequestId,
			reviewerId: command.reviewerId,
			reviewComment: command.reviewComment,
		});
	}
}

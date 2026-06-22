import { TenantAccessRequestAggregate } from "@cocrepo/aggregate";
import { RejectTenantAccessRequestCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(RejectTenantAccessRequestCommand)
export class RejectTenantAccessRequestUseCase {
	constructor(
		private readonly tenantAccessRequestService: TenantAccessRequestAggregate,
	) {}

	execute(command: RejectTenantAccessRequestCommand): Promise<unknown> {
		return this.tenantAccessRequestService.reject({
			tenantAccessRequestId: command.tenantAccessRequestId,
			reviewerId: command.reviewerId,
			reviewComment: command.reviewComment,
		});
	}
}

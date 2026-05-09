import { StringFieldOptional } from "@cocrepo/decorator";

export class CancelReservationDto {
	@StringFieldOptional({
		description: "취소 사유",
		maxLength: 1000,
		nullable: true,
	})
	cancelReason?: string | null;
}

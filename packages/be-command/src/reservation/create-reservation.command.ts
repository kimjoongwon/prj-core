import type { CreateReservationCommandParams } from "./create-reservation-command-params";

export class CreateReservationCommand {
	constructor(readonly params: CreateReservationCommandParams) {}
}

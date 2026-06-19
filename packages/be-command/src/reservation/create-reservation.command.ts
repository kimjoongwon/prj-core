import type { CreateReservationCommandInput } from "./create-reservation.input";

export class CreateReservationCommand {
	constructor(readonly input: CreateReservationCommandInput) {}
}

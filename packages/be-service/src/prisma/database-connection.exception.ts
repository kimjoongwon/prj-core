import { HttpException, HttpStatus } from "@nestjs/common";

export class DatabaseConnectionException extends HttpException {
	constructor(
		message = "데이터베이스에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.",
	) {
		super(
			{
				httpStatus: HttpStatus.SERVICE_UNAVAILABLE,
				message,
				error: "Database Connection Error",
			},
			HttpStatus.SERVICE_UNAVAILABLE,
		);
	}
}

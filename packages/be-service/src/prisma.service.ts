import { PrismaClient } from "@cocrepo/prisma";
import {
	HttpException,
	HttpStatus,
Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from "@nestjs/common";

/**
 * 데이터베이스 연결 실패 시 발생하는 예외
 * 500 대신 503 (Service Unavailable)을 사용하여 일시적인 문제임을 표시
 */
export class DatabaseConnectionException extends HttpException {
	constructor(message = "데이터베이스에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.") {
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

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(PrismaService.name);
	private isConnected = false;

	constructor() {
		super({
			datasources: {
				db: {
					url: process.env.DATABASE_URL,
				},
			},
		});
	}

	async onModuleInit() {
		try {
			await this.$connect();
			this.isConnected = true;
			this.logger.log("✅ PrismaModule initialized successfully");
		} catch (error) {
			this.isConnected = false;
			this.logger.error("❌ PrismaModule initialization failed:", error);
			// 앱 시작 시 연결 실패하면 명시적으로 에러 로그
			this.logger.error(
				"데이터베이스 연결을 확인하세요: PostgreSQL이 실행 중인지, DATABASE_URL이 올바른지 확인하세요.",
			);
			throw new DatabaseConnectionException(
				"데이터베이스 연결 실패: PostgreSQL이 실행 중인지 확인하세요.",
			);
		}
	}

	async onModuleDestroy() {
		if (this.isConnected) {
			await this.$disconnect();
			this.logger.log("PrismaModule disconnected");
		}
	}
}

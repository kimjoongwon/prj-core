import { Injectable, Logger, OnModuleInit } from "@nestjs/common";

/**
 * 문의 실시간 통신 게이트웨이 (Fallback)
 *
 * 네트워크 제한으로 WebSocket 관련 패키지 설치가 불가능한 환경에서
 * 서버 기동이 중단되지 않도록 no-op 구현을 제공합니다.
 */
@Injectable()
export class InquiriesGateway implements OnModuleInit {
	private readonly logger = new Logger(InquiriesGateway.name);

	onModuleInit() {
		this.logger.warn(
			"InquiriesGateway is running in fallback mode. Realtime features are disabled.",
		);
	}
}

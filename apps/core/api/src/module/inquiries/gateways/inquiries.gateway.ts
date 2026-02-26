import type { InquiryMessage, InquiryParticipant } from "@cocrepo/entity";
import {
	InquiriesService,
	InquiryMessagesService,
	InquiryParticipantsService,
} from "@cocrepo/service";
import { Logger } from "@nestjs/common";
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

/**
 * 문의 실시간 통신 게이트웨이
 *
 * 주요 기능:
 * - 실시간 메시지 수신/발신
 * - 타이핑 상태 브로드캐스트
 * - 참여자 온라인/오프라인 상태 관리
 * - 읽음 상태 동기화
 */
@WebSocketGateway({
	namespace: "/inquiries",
	cors: {
		origin: "*",
		credentials: true,
	},
})
export class InquiriesGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;

	private readonly logger = new Logger(InquiriesGateway.name);

	// 소켓 -> 사용자/문의 매핑
	private socketToUser = new Map<
		string,
		{ userId: string; inquiryId: string }
	>();

	constructor(
		private readonly inquiriesService: InquiriesService,
		private readonly inquiryMessagesService: InquiryMessagesService,
		private readonly inquiryParticipantsService: InquiryParticipantsService,
	) {}

	afterInit(_server: Server) {
		this.logger.log("InquiriesGateway 초기화 완료");
	}

	/**
	 * 클라이언트 연결 시
	 */
	async handleConnection(client: Socket): Promise<void> {
		const userId = client.handshake.auth?.userId as string | undefined;
		const inquiryId = client.handshake.auth?.inquiryId as string | undefined;

		if (!userId || !inquiryId) {
			this.logger.warn(
				`연결 거부: userId 또는 inquiryId 없음 (socket: ${client.id})`,
			);
			client.disconnect(true);
			return;
		}

		try {
			// 문의 존재 확인
			await this.inquiriesService.findById(inquiryId);

			// 소켓을 문의 룸에 조인
			client.join(`inquiry:${inquiryId}`);

			// 매핑 저장
			this.socketToUser.set(client.id, { userId, inquiryId });

			// 참여자 온라인 상태 업데이트
			await this.inquiryParticipantsService.updateOnlineStatus(
				inquiryId,
				userId,
				true,
			);

			// 다른 참여자에게 온라인 알림
			client.to(`inquiry:${inquiryId}`).emit("user:online", {
				userId,
				timestamp: new Date().toISOString(),
			});

			this.logger.debug(
				`클라이언트 연결: userId=${userId.slice(-8)}, inquiryId=${inquiryId.slice(-8)}`,
			);
		} catch (error) {
			this.logger.error(`연결 실패: ${error}`);
			client.disconnect(true);
		}
	}

	/**
	 * 클라이언트 연결 해제 시
	 */
	async handleDisconnect(client: Socket): Promise<void> {
		const mapping = this.socketToUser.get(client.id);
		if (!mapping) return;

		const { userId, inquiryId } = mapping;

		try {
			// 참여자 오프라인 상태 업데이트
			await this.inquiryParticipantsService.updateOnlineStatus(
				inquiryId,
				userId,
				false,
			);

			// 다른 참여자에게 오프라인 알림
			this.server.to(`inquiry:${inquiryId}`).emit("user:offline", {
				userId,
				timestamp: new Date().toISOString(),
			});

			this.logger.debug(
				`클라이언트 연결 해제: userId=${userId.slice(-8)}, inquiryId=${inquiryId.slice(-8)}`,
			);
		} catch (error) {
			this.logger.error(`연결 해제 처리 실패: ${error}`);
		} finally {
			this.socketToUser.delete(client.id);
		}
	}

	/**
	 * 메시지 전송
	 */
	@SubscribeMessage("message:send")
	async handleMessageSend(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		data: {
			threadId: string;
			content: string;
			contentType?: "TEXT" | "IMAGE" | "FILE" | "SYSTEM";
			clientMessageId?: string;
		},
	): Promise<{ success: boolean; message?: InquiryMessage; error?: string }> {
		const mapping = this.socketToUser.get(client.id);
		if (!mapping) {
			return { success: false, error: "인증되지 않은 연결입니다" };
		}

		const { userId, inquiryId } = mapping;

		try {
			const message = await this.inquiryMessagesService.create({
				inquiryId,
				threadId: data.threadId,
				senderId: userId,
				content: data.content,
				contentType: data.contentType ?? "TEXT",
				senderType: "USER",
				clientMessageId: data.clientMessageId,
			});

			// 문의의 마지막 메시지 시간 업데이트
			await this.inquiriesService.resetUnreadCount(inquiryId);

			// 룸에 브로드캐스트
			this.server.to(`inquiry:${inquiryId}`).emit("message:new", message);

			// 발신자에게 확인 응답
			return { success: true, message };
		} catch (error) {
			this.logger.error(`메시지 전송 실패: ${error}`);
			return { success: false, error: String(error) };
		}
	}

	/**
	 * 타이핑 시작
	 */
	@SubscribeMessage("typing:start")
	async handleTypingStart(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { threadId?: string },
	): Promise<void> {
		const mapping = this.socketToUser.get(client.id);
		if (!mapping) return;

		const { userId, inquiryId } = mapping;

		try {
			await this.inquiryParticipantsService.updateTypingStatus(
				inquiryId,
				userId,
				true,
			);

			client.to(`inquiry:${inquiryId}`).emit("user:typing", {
				userId,
				threadId: data.threadId,
				isTyping: true,
			});
		} catch (error) {
			this.logger.error(`타이핑 상태 업데이트 실패: ${error}`);
		}
	}

	/**
	 * 타이핑 종료
	 */
	@SubscribeMessage("typing:stop")
	async handleTypingStop(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { threadId?: string },
	): Promise<void> {
		const mapping = this.socketToUser.get(client.id);
		if (!mapping) return;

		const { userId, inquiryId } = mapping;

		try {
			await this.inquiryParticipantsService.updateTypingStatus(
				inquiryId,
				userId,
				false,
			);

			client.to(`inquiry:${inquiryId}`).emit("user:typing", {
				userId,
				threadId: data.threadId,
				isTyping: false,
			});
		} catch (error) {
			this.logger.error(`타이핑 상태 업데이트 실패: ${error}`);
		}
	}

	/**
	 * 메시지 읽음 처리
	 */
	@SubscribeMessage("message:read")
	async handleMessageRead(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { messageId: string },
	): Promise<{ success: boolean }> {
		const mapping = this.socketToUser.get(client.id);
		if (!mapping) {
			return { success: false };
		}

		const { userId, inquiryId } = mapping;

		try {
			// 메시지 읽음 처리
			await this.inquiryMessagesService.markRead(data.messageId);

			// 참여자 읽음 상태 업데이트
			await this.inquiryParticipantsService.markAsRead(inquiryId, userId);

			// 다른 참여자에게 읽음 알림
			client.to(`inquiry:${inquiryId}`).emit("message:read", {
				messageId: data.messageId,
				userId,
				timestamp: new Date().toISOString(),
			});

			return { success: true };
		} catch (error) {
			this.logger.error(`읽음 처리 실패: ${error}`);
			return { success: false };
		}
	}

	/**
	 * 참여자 목록 조회
	 */
	@SubscribeMessage("participants:get")
	async handleGetParticipants(
		@ConnectedSocket() client: Socket,
	): Promise<{ success: boolean; participants?: InquiryParticipant[] }> {
		const mapping = this.socketToUser.get(client.id);
		if (!mapping) {
			return { success: false };
		}

		const { inquiryId } = mapping;

		try {
			const participants =
				await this.inquiryParticipantsService.getByInquiry(inquiryId);
			return { success: true, participants };
		} catch (error) {
			this.logger.error(`참여자 목록 조회 실패: ${error}`);
			return { success: false };
		}
	}

	/**
	 * 문의 룸에 이벤트 브로드캐스트 (외부에서 호출용)
	 */
	broadcastToInquiry(inquiryId: string, event: string, data: unknown): void {
		this.server.to(`inquiry:${inquiryId}`).emit(event, data);
	}
}

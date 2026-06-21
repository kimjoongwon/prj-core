import { Inquiry, InquiryMessage, InquiryParticipant } from "@cocrepo/entity";
import {
	InquiryCategory,
	InquiryChannel,
	InquiryPriority,
	InquirySource,
	InquiryStatus,
	type MessageContentType,
	type Prisma,
	type SenderType,
	type SentimentType,
} from "@cocrepo/prisma";
import { InquiriesRepository } from "@cocrepo/repository";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import type { FillInquiryFormInput } from "./fill-inquiry-form-input";
import type { FillInquiryFormResult } from "./fill-inquiry-form-result";
import { INQUIRY_CATEGORY_LABELS } from "./inquiry-category-labels";
import { INQUIRY_CHANNEL_LABELS } from "./inquiry-channel-labels";
import type { InquiryCreateUpdateFormBootstrap } from "./inquiry-create-update-form-bootstrap";
import type { InquiryFormFieldMeta } from "./inquiry-form-field-meta";
import type { InquiryFormOptionItem } from "./inquiry-form-option-item";
import type { InquiryFormPatch } from "./inquiry-form-patch";
import type { InquiryFormSchema } from "./inquiry-form-schema";
import type { InquiryFormUiPaths } from "./inquiry-form-ui-paths";
import { INQUIRY_PRIORITY_LABELS } from "./inquiry-priority-labels";
import { INQUIRY_SOURCE_LABELS } from "./inquiry-source-labels";
import type { InquiryStats } from "./inquiry-stats";
import { INQUIRY_STATUS_LABELS } from "./inquiry-status-labels";
import type { SentimentAnalysisResult } from "./sentiment-analysis-result";
import { VALID_STATUS_TRANSITIONS } from "./valid-status-transitions";

@Injectable()
export class InquiryAggregate {
	private readonly logger = new Logger(InquiryAggregate.name);

	constructor(private readonly repository: InquiriesRepository) {}

	// ============================================================================
	// 조회
	// ============================================================================

	/**
	 * ID로 문의 조회
	 */
	async findById(id: string): Promise<Inquiry> {
		const inquiry = await this.repository.findById(id);
		if (!inquiry) {
			throw new NotFoundException("문의를 찾을 수 없습니다");
		}
		return inquiry;
	}

	/**
	 * ID로 상세 조회 (스레드, 메시지, 참여자 포함)
	 */
	async findByIdWithDetails(id: string, spaceIds?: string[]): Promise<Inquiry> {
		const inquiry =
			await this.repository.findByIdWithThreadsAndMessagesAndParticipants(
				id,
				spaceIds,
			);
		if (!inquiry) {
			throw new NotFoundException("문의를 찾을 수 없습니다");
		}
		return inquiry;
	}

	/**
	 * 문의 번호로 조회
	 */
	async findByNumber(inquiryNumber: string): Promise<Inquiry> {
		const inquiry = await this.repository.findByNumber(inquiryNumber);
		if (!inquiry) {
			throw new NotFoundException("문의를 찾을 수 없습니다");
		}
		return inquiry;
	}

	/**
	 * 목록 조회
	 */
	async list(params: {
		where: Prisma.InquiryWhereInput;
		orderBy: Prisma.InquiryOrderByWithRelationInput[];
		skip?: number;
		take?: number;
		spaceIds?: string[];
	}): Promise<{ items: Inquiry[]; totalCount: number }> {
		return this.repository.findMany({
			...params,
			where: this.applySpaceScope(params.where, params.spaceIds),
		});
	}

	// ============================================================================
	// Create/Update Form Bootstrap + AI Fill
	// ============================================================================

	async getCreateFormBootstrap(): Promise<InquiryCreateUpdateFormBootstrap> {
		return {
			mode: "CREATE",
			defaultObject: {
				title: "",
				category: InquiryCategory.GENERAL,
				priority: InquiryPriority.NORMAL,
				content: "",
				channel: InquiryChannel.WEB,
				source: InquirySource.ONLINE,
				status: InquiryStatus.NEW,
			},
			options: this.buildFormOptions(),
			ui: this.buildUiPaths("CREATE"),
			fieldMeta: this.buildFieldMeta("CREATE"),
			aiSchemas: this.buildAiSchemas("CREATE"),
		};
	}

	async getUpdateFormBootstrap(
		inquiryId: string,
		spaceIds?: string[],
	): Promise<InquiryCreateUpdateFormBootstrap> {
		const inquiry = await this.findByIdWithDetails(inquiryId, spaceIds);

		return {
			mode: "UPDATE",
			defaultObject: {
				title: inquiry.title,
				category: inquiry.category,
				priority: inquiry.priority,
				content: "",
				channel: inquiry.channel,
				source: inquiry.source ?? InquirySource.ONLINE,
				status: inquiry.status,
			},
			options: this.buildFormOptions(),
			ui: this.buildUiPaths("UPDATE"),
			fieldMeta: this.buildFieldMeta("UPDATE"),
			aiSchemas: this.buildAiSchemas("UPDATE"),
		};
	}

	fillFormWithAi(input: FillInquiryFormInput): FillInquiryFormResult {
		const schemas = this.buildAiSchemas(input.mode);
		const selectedSchema = schemas.find(
			(schema) => schema.key === input.schemaKey,
		);
		if (!selectedSchema) {
			throw new BadRequestException("유효하지 않은 AI 스키마 키입니다");
		}

		const uiPaths = this.buildUiPaths(input.mode);
		const fieldMeta = this.buildFieldMeta(input.mode);
		const blockedPaths = new Set([
			...uiPaths.hiddenPaths,
			...uiPaths.readOnlyPaths,
			...uiPaths.disabledPaths,
		]);
		const requestedPaths = Array.from(new Set(input.selectedPaths));

		if (requestedPaths.length === 0) {
			throw new BadRequestException(
				"selectedPaths는 최소 1개 이상이어야 합니다",
			);
		}

		const fillablePaths = selectedSchema.paths.filter((path) => {
			const aiMeta = fieldMeta[path]?.ai;
			return Boolean(aiMeta?.fillable) && !blockedPaths.has(path);
		});
		const invalidPaths = requestedPaths.filter(
			(path) => !fillablePaths.includes(path),
		);

		if (invalidPaths.length > 0) {
			throw new BadRequestException(
				`AI 채움이 허용되지 않은 path가 포함되어 있습니다: ${invalidPaths.join(", ")}`,
			);
		}

		const currentTitle = this.getString(input.currentObject.title);
		const currentContent = this.getString(input.currentObject.content);
		const normalizedPrompt = this.normalizeText(
			this.getString(input.userPrompt),
		);
		const normalizedText = this.normalizeText(
			[normalizedPrompt, currentTitle, currentContent]
				.filter((value) => value.length > 0)
				.join("\n"),
		);
		const nextCategory =
			this.detectCategory(normalizedText) ??
			this.toInquiryCategory(input.currentObject.category) ??
			InquiryCategory.GENERAL;
		const nextPriority =
			this.detectPriority(normalizedText) ??
			this.toInquiryPriority(input.currentObject.priority) ??
			InquiryPriority.NORMAL;
		const nextTitle = this.suggestTitle({
			currentTitle,
			currentContent,
			prompt: normalizedPrompt,
			category: nextCategory,
		});
		const nextContent = this.suggestContent({
			currentContent,
			prompt: normalizedPrompt,
			title: nextTitle,
		});

		const patches: InquiryFormPatch[] = [];
		const maybePush = (path: string, value: unknown) => {
			if (!requestedPaths.includes(path)) {
				return;
			}
			const currentValue = input.currentObject[path];
			if (this.isSameValue(currentValue, value)) {
				return;
			}
			patches.push({ path, value });
		};

		maybePush("title", nextTitle);
		maybePush("category", nextCategory);
		maybePush("priority", nextPriority);
		maybePush("content", nextContent);

		return { patches };
	}

	// ============================================================================
	// 생성/수정/삭제
	// ============================================================================

	/**
	 * 문의 생성 (문의 번호 자동 생성)
	 */
	@Transactional()
	async create(
		data: Omit<Prisma.InquiryUncheckedCreateInput, "inquiryNumber">,
		actorUserId: string,
		initialContent?: string | null,
	): Promise<Inquiry> {
		this.logger.debug("문의 생성 중...");

		// 문의 번호 자동 생성 (YYYYMMDD-NNNN 형식)
		const inquiryNumber = this.generateInquiryNumber();

		const inquiry = await this.repository.create({
			...data,
			inquiryNumber,
		});

		const defaultThread = await this.repository.createThread({
			inquiryId: inquiry.id,
			createdBy: data.customerId ?? actorUserId,
			title: inquiry.title,
		});

		if (initialContent && initialContent.trim().length > 0) {
			await this.sendMessage({
				inquiryId: inquiry.id,
				actorUserId: data.customerId ?? actorUserId,
				threadId: defaultThread.id,
				content: initialContent,
				contentType: "TEXT",
				senderType: "USER",
			});
		}

		return this.findByIdWithDetails(inquiry.id);
	}

	/**
	 * 문의 수정
	 */
	async update(
		id: string,
		data: Prisma.InquiryUncheckedUpdateInput,
	): Promise<Inquiry> {
		this.logger.debug(`문의 수정: ${id.slice(-8)}`);

		// 존재 확인
		await this.findById(id);

		return this.repository.updateById(id, data);
	}

	/**
	 * 소프트 삭제
	 */
	async softDelete(id: string): Promise<Inquiry> {
		this.logger.debug(`문의 소프트 삭제: ${id.slice(-8)}`);

		// 존재 확인
		await this.findById(id);

		return this.repository.removeById(id);
	}

	// ============================================================================
	// 메시지/참여자
	// ============================================================================

	async listMessages(params: {
		inquiryId: string;
		skip?: number;
		take?: number;
	}): Promise<{ items: InquiryMessage[]; totalCount: number }> {
		await this.findById(params.inquiryId);
		return this.repository.findMessagesByInquiryId(params);
	}

	async sendMessage(params: {
		inquiryId: string;
		actorUserId: string;
		threadId?: string;
		content: string;
		contentType?: MessageContentType;
		senderType?: SenderType;
		clientMessageId?: string;
	}): Promise<InquiryMessage> {
		const inquiry = await this.findById(params.inquiryId);
		if (inquiry.status === "CLOSED") {
			throw new BadRequestException(
				"종료된 문의에는 메시지를 전송할 수 없습니다",
			);
		}

		const thread = params.threadId
			? await this.repository.findThreadById(params.threadId)
			: await this.repository.findDefaultThreadByInquiryId(params.inquiryId);

		if (!thread || thread.inquiryId !== params.inquiryId) {
			throw new NotFoundException("문의 스레드를 찾을 수 없습니다");
		}

		if (params.clientMessageId) {
			const exists = await this.repository.existsMessageByClientMessageId(
				thread.id,
				params.clientMessageId,
			);
			if (exists) {
				throw new BadRequestException(
					"이미 처리된 메시지입니다 (중복 clientMessageId)",
				);
			}
		}

		const senderType = params.senderType ?? "USER";
		const message = await this.repository.createMessage({
			inquiryId: params.inquiryId,
			threadId: thread.id,
			senderId: params.actorUserId,
			content: params.content,
			contentType: params.contentType ?? "TEXT",
			senderType,
			clientMessageId: params.clientMessageId,
		});

		await Promise.all([
			this.repository.touchThreadAfterMessage(thread.id, params.content),
			this.repository.recordMessageActivityById(params.inquiryId),
			this.repository.incrementParticipantUnreadByInquiryId(
				params.inquiryId,
				params.actorUserId,
			),
		]);

		if (inquiry.customerId !== params.actorUserId) {
			await this.repository.recordFirstResponseById(params.inquiryId);
		}

		return message;
	}

	async getParticipants(inquiryId: string): Promise<InquiryParticipant[]> {
		await this.findById(inquiryId);
		return this.repository.findParticipantsByInquiryId(inquiryId);
	}

	// ============================================================================
	// 담당자 배정
	// ============================================================================

	/**
	 * 담당자 배정
	 * - NEW 상태면 OPEN으로 변경
	 */
	async assignTo(id: string, assigneeId: string): Promise<Inquiry> {
		this.logger.debug(
			`담당자 배정: ${id.slice(-8)} -> ${assigneeId.slice(-8)}`,
		);

		const inquiry = await this.findById(id);

		// 이미 종료된 문의는 담당자 배정 불가
		if (inquiry.status === "CLOSED") {
			throw new BadRequestException(
				"종료된 문의는 담당자를 배정할 수 없습니다",
			);
		}

		return this.repository.updateAssigneeById(id, assigneeId);
	}

	// ============================================================================
	// 상태 관리
	// ============================================================================

	/**
	 * 상태 변경 (상태 머신 검증)
	 */
	async updateStatus(id: string, newStatus: InquiryStatus): Promise<Inquiry> {
		this.logger.debug(`상태 변경: ${id.slice(-8)} -> ${newStatus}`);

		const inquiry = await this.findById(id);

		// 상태 전이 검증
		this.validateStatusTransition(inquiry.status, newStatus);

		// RESOLVED로 변경 시 첫 응답 시간 기록 (아직 없으면)
		if (newStatus === "RESOLVED" && !inquiry.firstResponseAt) {
			await this.repository.recordFirstResponseById(id);
		}

		return this.repository.updateStatusById(id, newStatus);
	}

	/**
	 * 우선순위 변경
	 */
	async updatePriority(
		id: string,
		priority: InquiryPriority,
	): Promise<Inquiry> {
		this.logger.debug(`우선순위 변경: ${id.slice(-8)} -> ${priority}`);

		// 존재 확인
		await this.findById(id);

		return this.repository.updatePriorityById(id, priority);
	}

	// ============================================================================
	// 통계
	// ============================================================================

	/**
	 * 상태별/카테고리별 통계
	 */
	async getStats(spaceIds?: string[]): Promise<InquiryStats> {
		this.logger.debug(
			`문의 통계 조회: spaceIds=${spaceIds?.length ?? "all"}개`,
		);

		const [byStatus, byCategory, overdue] = await Promise.all([
			this.repository.countByStatus(spaceIds),
			this.repository.countByCategory(spaceIds),
			this.repository.countOverdue(spaceIds),
		]);

		return {
			byStatus,
			byCategory,
			overdue,
		};
	}

	private applySpaceScope(
		where: Prisma.InquiryWhereInput,
		spaceIds?: string[],
	): Prisma.InquiryWhereInput {
		if (spaceIds === undefined) {
			return where;
		}

		return {
			...where,
			tenant: { spaceId: { in: spaceIds } },
		};
	}

	/**
	 * SLA 초과 문의 목록
	 */
	async getOverdueList(params?: {
		spaceId?: string;
		skip?: number;
		take?: number;
	}): Promise<{ items: Inquiry[]; totalCount: number }> {
		this.logger.debug("SLA 초과 문의 목록 조회");
		return this.repository.findOverdueSla(params);
	}

	// ============================================================================
	// AI 기능
	// ============================================================================

	/**
	 * 감정 분석
	 * 실제 구현은 별도 AI 서비스 또는 UseCase에서 처리
	 */
	async analyzeSentiment(inquiryId: string): Promise<SentimentAnalysisResult> {
		this.logger.debug(`감정 분석 요청: ${inquiryId.slice(-8)}`);

		// 존재 확인
		await this.findById(inquiryId);

		// TODO: 실제 AI 서비스 연동
		throw new BadRequestException("감정 분석 기능이 아직 구현되지 않았습니다");
	}

	/**
	 * 감정 분석 결과 업데이트 (AI 서비스에서 호출)
	 */
	async updateSentiment(
		id: string,
		sentiment: SentimentType,
		sentimentScore: number,
	): Promise<Inquiry> {
		this.logger.debug(`감정 분석 결과 업데이트: ${id.slice(-8)}`);
		return this.repository.updateSentimentById(id, sentiment, sentimentScore);
	}

	// ============================================================================
	// 읽음 상태
	// ============================================================================

	/**
	 * 읽지 않은 메시지 수 초기화
	 */
	async resetUnreadCount(id: string): Promise<Inquiry> {
		this.logger.debug(`읽지 않은 메시지 수 초기화: ${id.slice(-8)}`);
		return this.repository.resetUnreadCountById(id);
	}

	/**
	 * 읽지 않은 메시지 수 증가
	 */
	async incrementUnreadCount(id: string): Promise<Inquiry> {
		this.logger.debug(`읽지 않은 메시지 수 증가: ${id.slice(-8)}`);
		return this.repository.incrementUnreadCountById(id);
	}

	// ============================================================================
	// 첫 응답
	// ============================================================================

	/**
	 * 첫 응답 시간 기록
	 */
	async recordFirstResponse(id: string): Promise<Inquiry> {
		this.logger.debug(`첫 응답 기록: ${id.slice(-8)}`);
		return this.repository.recordFirstResponseById(id);
	}

	// ============================================================================
	// Private 메서드
	// ============================================================================

	private buildFormOptions(): Record<string, InquiryFormOptionItem[]> {
		return {
			category: Object.values(InquiryCategory).map((value) => ({
				value,
				label: INQUIRY_CATEGORY_LABELS[value],
			})),
			priority: Object.values(InquiryPriority).map((value) => ({
				value,
				label: INQUIRY_PRIORITY_LABELS[value],
			})),
			channel: Object.values(InquiryChannel).map((value) => ({
				value,
				label: INQUIRY_CHANNEL_LABELS[value],
			})),
			source: Object.values(InquirySource).map((value) => ({
				value,
				label: INQUIRY_SOURCE_LABELS[value],
			})),
			status: Object.values(InquiryStatus).map((value) => ({
				value,
				label: INQUIRY_STATUS_LABELS[value],
			})),
		};
	}

	private buildUiPaths(mode: "CREATE" | "UPDATE"): InquiryFormUiPaths {
		if (mode === "UPDATE") {
			return {
				readOnlyPaths: ["channel", "source"],
				hiddenPaths: ["content", "channel", "source"],
				disabledPaths: [],
			};
		}
		return {
			readOnlyPaths: [],
			hiddenPaths: [],
			disabledPaths: [],
		};
	}

	private buildFieldMeta(
		mode: "CREATE" | "UPDATE",
	): Record<string, InquiryFormFieldMeta> {
		const isCreate = mode === "CREATE";

		return {
			title: {
				label: "문의 제목",
				ai: { fillable: true, defaultChecked: true },
			},
			category: {
				label: "문의 카테고리",
				ai: { fillable: true, defaultChecked: true },
			},
			priority: {
				label: "우선순위",
				ai: { fillable: true, defaultChecked: true },
			},
			content: {
				label: "문의 내용",
				ai: isCreate
					? { fillable: true, defaultChecked: true }
					: {
							fillable: false,
							reason: "UPDATE 모드에서는 content 수정이 비활성화됩니다.",
						},
			},
			channel: {
				label: "문의 채널",
				ai: {
					fillable: false,
					reason: "채널은 운영 정책상 수동으로만 설정할 수 있습니다.",
				},
			},
			source: {
				label: "접수 유형",
				ai: {
					fillable: false,
					reason: "접수 유형은 운영 정책상 수동으로만 설정할 수 있습니다.",
				},
			},
		};
	}

	private buildAiSchemas(mode: "CREATE" | "UPDATE"): InquiryFormSchema[] {
		if (mode === "UPDATE") {
			return [
				{
					key: "inquiry-update-basic",
					label: "문의 수정 기본 채움",
					paths: ["title", "category", "priority"],
					description: "문의 수정 시 핵심 메타 필드를 AI로 채웁니다.",
				},
			];
		}

		return [
			{
				key: "inquiry-intake-basic",
				label: "문의 접수 기본 채움",
				paths: ["title", "category", "priority", "content"],
				description: "문의 접수 시 핵심 4개 필드를 AI로 채웁니다.",
			},
		];
	}

	private getString(value: unknown): string {
		if (typeof value === "string") {
			return value.trim();
		}
		return "";
	}

	private normalizeText(value: string): string {
		return value.toLowerCase().replace(/\s+/g, " ").trim();
	}

	private toInquiryCategory(value: unknown): InquiryCategory | null {
		if (typeof value !== "string") {
			return null;
		}
		return Object.values(InquiryCategory).includes(value as InquiryCategory)
			? (value as InquiryCategory)
			: null;
	}

	private toInquiryPriority(value: unknown): InquiryPriority | null {
		if (typeof value !== "string") {
			return null;
		}
		return Object.values(InquiryPriority).includes(value as InquiryPriority)
			? (value as InquiryPriority)
			: null;
	}

	private detectCategory(text: string): InquiryCategory | null {
		if (!text) {
			return null;
		}

		if (
			text.includes("배송") ||
			text.includes("택배") ||
			text.includes("delivery")
		) {
			return InquiryCategory.DELIVERY;
		}
		if (
			text.includes("결제") ||
			text.includes("payment") ||
			text.includes("카드")
		) {
			return InquiryCategory.PAYMENT;
		}
		if (
			text.includes("환불") ||
			text.includes("취소") ||
			text.includes("refund")
		) {
			return InquiryCategory.REFUND;
		}
		if (text.includes("상품") || text.includes("product")) {
			return InquiryCategory.PRODUCT;
		}
		if (
			text.includes("계정") ||
			text.includes("로그인") ||
			text.includes("account")
		) {
			return InquiryCategory.ACCOUNT;
		}
		if (
			text.includes("오류") ||
			text.includes("버그") ||
			text.includes("technical")
		) {
			return InquiryCategory.TECHNICAL;
		}
		if (text.includes("불만") || text.includes("complaint")) {
			return InquiryCategory.COMPLAINT;
		}

		return InquiryCategory.GENERAL;
	}

	private detectPriority(text: string): InquiryPriority | null {
		if (!text) {
			return null;
		}

		if (
			text.includes("긴급") ||
			text.includes("당장") ||
			text.includes("즉시") ||
			text.includes("critical") ||
			text.includes("urgent")
		) {
			return InquiryPriority.URGENT;
		}
		if (
			text.includes("불만") ||
			text.includes("화남") ||
			text.includes("빠르게") ||
			text.includes("high priority")
		) {
			return InquiryPriority.HIGH;
		}
		if (text.includes("천천히") || text.includes("low priority")) {
			return InquiryPriority.LOW;
		}

		return InquiryPriority.NORMAL;
	}

	private suggestTitle(params: {
		currentTitle: string;
		currentContent: string;
		prompt: string;
		category: InquiryCategory;
	}): string {
		if (params.currentTitle.length >= 2) {
			return params.currentTitle.slice(0, 200);
		}

		const sourceText = [params.prompt, params.currentContent].find(
			(value) => value.length > 0,
		);
		if (!sourceText) {
			return `${INQUIRY_CATEGORY_LABELS[params.category]} 문의`;
		}

		const firstLine = sourceText
			.split(/\n|[.!?]/)
			.map((segment) => segment.trim())
			.find((segment) => segment.length > 0);

		if (!firstLine) {
			return `${INQUIRY_CATEGORY_LABELS[params.category]} 문의`;
		}

		return firstLine.slice(0, 200);
	}

	private suggestContent(params: {
		currentContent: string;
		prompt: string;
		title: string;
	}): string {
		if (params.currentContent.length >= 10) {
			return params.currentContent;
		}
		if (params.prompt.length >= 10) {
			return params.prompt;
		}
		if (params.title.length > 0) {
			return `${params.title} 관련 문의입니다.`;
		}
		return "문의 내용을 입력해주세요.";
	}

	private isSameValue(left: unknown, right: unknown): boolean {
		if (typeof left === "string" && typeof right === "string") {
			return left.trim() === right.trim();
		}
		return left === right;
	}

	/**
	 * 상태 전이 검증
	 */
	private validateStatusTransition(
		currentStatus: InquiryStatus,
		newStatus: InquiryStatus,
	): void {
		const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus];

		if (!allowedTransitions.includes(newStatus)) {
			throw new BadRequestException(
				`${currentStatus} 상태에서 ${newStatus} 상태로 변경할 수 없습니다`,
			);
		}
	}

	/**
	 * 문의 번호 생성 (INQ-YYYYMMDD-NNNN 형식)
	 */
	private generateInquiryNumber(): string {
		const now = new Date();
		const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");

		// 간단한 구현: 타임스탬프 기반 고유 번호
		// 실제로는 Repository에서 count 쿼리로 구현 권장
		const sequence = Date.now().toString().slice(-4);

		return `INQ-${datePart}-${sequence}`;
	}
}

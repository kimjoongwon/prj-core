/**
 * AI 제공자 타입
 */
export type AIProvider = "OPENAI" | "ANTHROPIC";

/**
 * 실행 상태 타입
 */
export type ExecutionStatus =
	| "PENDING"
	| "RUNNING"
	| "SUCCESS"
	| "FAILED"
	| "TIMEOUT"
	| "CANCELLED";

/**
 * 폼 필드 타입
 */
export type FormFieldType =
	| "TEXT"
	| "TEXTAREA"
	| "NUMBER"
	| "SELECT"
	| "MULTI_SELECT"
	| "CHECKBOX"
	| "RADIO"
	| "DATE"
	| "DATETIME"
	| "EMAIL"
	| "PHONE"
	| "URL";

/**
 * AI 폼 필드 설정
 */
export interface AIFormFieldConfig {
	id: string;
	templateId: string;
	fieldName: string;
	fieldLabel: string;
	fieldType: FormFieldType;
	prompt: string;
	isRequired: boolean;
	order: number;
	defaultValue?: string;
	validationRegex?: string;
	options?: string; // JSON 문자열
	parentFieldId?: string;
	groupName?: string;
	description?: string;
	placeholder?: string;
	maxLength?: number;
	minLength?: number;
	minValue?: number;
	maxValue?: number;
	createdAt: Date;
	updatedAt: Date | null;
}

/**
 * AI 폼 템플릿
 */
export interface AIFormTemplate {
	id: string;
	spaceId: string;
	name: string;
	description?: string;
	targetDomain: string;
	targetEntity?: string;
	aiProvider: AIProvider;
	model?: string;
	systemPrompt?: string;
	priority: number;
	allowUserPrompt: boolean;
	maxTokens?: number;
	temperature?: number;
	topP?: number;
	frequencyPenalty?: number;
	presencePenalty?: number;
	createdById?: string;
	updatedById?: string;
	createdAt: Date;
	updatedAt: Date | null;
	removedAt: Date | null;

	// Relations
	fields?: AIFormFieldConfig[];
}

/**
 * AI 실행 결과 필드
 */
export interface AIFormFieldResult {
	fieldName: string;
	fieldLabel: string;
	value: unknown;
	confidence?: number;
	reason?: string;
}

/**
 * AI 폼 실행 요청
 */
export interface AIFormExecuteRequest {
	templateId: string;
	context?: string; // JSON 문자열
	userPrompt?: string;
	autoApply?: boolean;
	targetEntityId?: string;
}

/**
 * AI 폼 미리보기 요청
 */
export interface AIFormPreviewRequest {
	templateId: string;
	context?: string; // JSON 문자열
	userPrompt?: string;
}

/**
 * AI 폼 실행 응답
 */
export interface AIFormExecuteResponse {
	id: string;
	templateId: string;
	status: ExecutionStatus;
	aiProvider: AIProvider;
	model?: string;
	results: AIFormFieldResult[];
	isApplied: boolean;
	appliedAt?: Date;
	targetEntityId?: string;
	tokensUsed?: number;
	executionTimeMs?: number;
	errorMessage?: string;
	createdAt: Date;
}

/**
 * AI 폼 미리보기 응답
 */
export interface AIFormPreviewResponse {
	results: AIFormFieldResult[];
	model?: string;
	estimatedTokens?: number;
	confidence?: number;
	suggestions?: string[];
}

/**
 * AI 폼 템플릿 통계
 */
export interface AIFormTemplateStats {
	total: number;
}

/**
 * AI 폼 템플릿 페이지네이션 메타
 */
export interface AIFormTemplatePaginationMeta {
	total: number;
	skip: number;
	take: number;
	totalPages: number;
}

/**
 * AI 폼 실행 컨텍스트
 */
export interface AIFormExecutionContext {
	// 현재 폼 값들
	currentValues?: Record<string, unknown>;
	// 관련 엔티티 정보
	entityData?: Record<string, unknown>;
	// 추가 컨텍스트
	extraContext?: Record<string, unknown>;
}

/**
 * AI 폼 필드 옵션
 */
export interface AIFormFieldOption {
	label: string;
	value: string;
}

/**
 * AI 제공자별 모델 정보
 */
export interface AIModelInfo {
	id: string;
	name: string;
	provider: AIProvider;
	maxTokens: number;
	supportsTemperature: boolean;
	supportsTopP: boolean;
}

/**
 * AI 제공자 상태
 */
export interface AIProviderStatus {
	provider: AIProvider;
	isAvailable: boolean;
	models: AIModelInfo[];
	errorMessage?: string;
}

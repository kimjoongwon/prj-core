import type { DatabaseId } from "./database-id";

// ============================================
// Entity 관련 타입
// ============================================

/**
 * 인스턴스화 가능한 클래스를 나타내는 제네릭 생성자 타입
 * @template T - 생성자가 생성하는 인스턴스의 타입
 * @template Arguments - 생성자 인자 타입 배열 (기본값: unknown[])
 */
export type Constructor<
	T = unknown,
	Arguments extends unknown[] = unknown[],
> = new (...arguments_: Arguments) => T;

/**
 * 모든 엔티티가 가지는 공통 필드 인터페이스
 */
export interface BaseEntityFields {
	id: DatabaseId;
	createdAt: Date;
	updatedAt: Date | null;
	removedAt: Date | null;
}

export { parseBigIntJson, stringifyBigIntJson } from "./bigint-json";
export type { DatabaseId, DecimalId } from "./database-id";
export {
	DATABASE_ID_MAX,
	DATABASE_ID_MIN,
	DECIMAL_ID_PATTERN,
	DECIMAL_ID_PATTERN_SOURCE,
	formatDatabaseId,
	isDecimalId,
	parseDecimalId,
	requireDecimalId,
} from "./database-id";
export type { IntegrationUlid } from "./integration-ulid";
export {
	INTEGRATION_ULID_PATTERN,
	INTEGRATION_ULID_PATTERN_SOURCE,
	isIntegrationUlid,
	parseIntegrationUlid,
} from "./integration-ulid";

// ============================================
// Core type utilities
// ============================================
export type Join<K, P> = K extends string | number
	? P extends string | number
		? `${K}${"" extends P ? "" : "."}${P}`
		: never
	: never;

export type Prev = [
	never,
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
	...0[],
];

export type Paths<T, D extends number = 10> = [D] extends [never]
	? never
	: T extends object
		? {
				[K in keyof T]-?: K extends string | number
					? `${K}` | Join<K, Paths<T[K], Prev[D]>>
					: never;
			}[keyof T]
		: "";

export type Leaves<T, D extends number = 10> = [D] extends [never]
	? never
	: T extends object
		? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
		: "";

export type Option = {
	text: string;
	value: string | number;
};

export interface MobxProps<T = unknown> {
	path: Paths<T, 4>;
	state: T;
}

export interface FormUnitProps<T> {
	state: T;
	path: Leaves<T, 4>;
}

// Multi-path support for useFormField
export type PathTuple<T> = readonly [
	Paths<T, 4>,
	Paths<T, 4>,
	...Paths<T, 4>[],
];

// ValueSplitter function type - splits a single value into multiple path values
// UI Component Value → Multiple State Path Values
export type ValueSplitter<TValue, TPaths extends readonly string[]> = (
	value: TValue,
	paths: TPaths,
) => Record<string, unknown>;

// ValueAggregator function type - aggregates multiple path values into a single value
// Multiple State Path Values → UI Component Value
export type ValueAggregator<TValue, TPaths extends readonly string[]> = (
	values: Record<string, unknown>,
	paths: TPaths,
) => TValue;

export type {
	AbilityApiResponse,
	AbilityRule,
	AppAction,
	AppSubject,
} from "./ability";
// ============================================
// CASL/Permission 관련 타입
// ============================================
export { APP_ACTIONS } from "./ability";
// ============================================
// Action Config 관련 타입
// ============================================
export type {
	ActionConfig,
	ActionFormatConfig,
	ActionMaskingConfig,
	ActionTransformConfig,
} from "./action-config";
export type { ApiDatabaseError } from "./api-error";
// ============================================
// App 상태 계약 타입
// ============================================
export type {
	AbilityChecker,
	AppProviderConfig,
	NavItemScopeChecker,
	NavigatorLike,
} from "./app-contracts";
// ============================================
// Config 관련 타입
// ============================================
export type {
	AllConfigType,
	AppConfig,
	AppleConfig,
	AuthConfig,
	CorsConfig,
	DatabaseConfig,
	FacebookConfig,
	FileConfig,
	GoogleConfig,
	MailConfig,
	ObjectStorageConfig,
	ObjectStorageProvider,
	RedisConfig,
	SMTPConfig,
	TwitterConfig,
} from "./config.types";
export type {
	ContextAssociationSnapshot,
	ContextCategorySnapshot,
	ContextClassificationSnapshot,
	ContextRoleSnapshot,
	ContextSpaceSnapshot,
	ContextTenantSnapshot,
	ContextUserSnapshot,
} from "./context-snapshot";
// ============================================
// Create/Update Form Bootstrap 관련 타입
// ============================================
export type {
	CreateUpdateFormBootstrap,
	FormFieldMeta,
	FormOptionItem,
	FormUiPaths,
} from "./form-bootstrap";
export type {
	FormFeedbackActions,
	FormFeedbackState,
	FormFieldErrors,
	FormSchemaField,
	FormSchemaStateContract,
	FormStateContract,
} from "./form-state";
// ============================================
// Hook 계약 타입
// ============================================
export type {
	AccountBootstrapLike,
	AccountBootstrapSpaceLike,
	AccountTenantSelection,
	UseAbilitiesOptions,
	UseAbilitiesReturn,
	UseAccountBootstrapOptions,
	UseAccountBootstrapReturn,
	UseFormFieldMultiOptions,
	UseFormFieldReturn,
	UseFormFieldSingleOptions,
} from "./hook-contracts";
// ============================================
// HTTP request-like 계약 타입
// ============================================
export type { HttpRequestLike } from "./http-request-like";
// ============================================
// 아이콘 관련 타입
// ============================================
export type { AppIconName } from "./icon";
// ============================================
// Inquiry 관련 타입
// ============================================
export type {
	InquiryCategory,
	InquiryChannel,
	InquiryMessage,
	InquiryParticipant,
	InquiryPriority,
	InquiryStatus,
} from "./inquiry";
// ============================================
// JSON 관련 타입
// ============================================
export type { JsonArray, JsonObject, JsonValue } from "./json";
// ============================================
// 네비게이션 관련 타입
// ============================================
export type {
	NavItemConfig,
	ScreenScopeKind,
	TabConfig,
} from "./navigation";
// ============================================
// OIDC 로그인 UI 관련 타입
// ============================================
export type {
	OidcClientLoginUi,
	OidcClientLoginUiVariant,
} from "./oidc-login-ui";
// ============================================
// 페이지 메타 관련 타입
// ============================================
export type { IPageMeta } from "./page-meta";
export type {
	OffsetPaginatedResponse,
	OffsetPaginationMeta,
	OffsetStatsPaginatedResponse,
	PagePaginatedResponse,
	PagePaginationMeta,
} from "./pagination";
export { SpaceResourceScope } from "./space-resource-scope";
export { SpaceScope } from "./space-scope";
// ============================================
// Storybook 기획 시나리오 타입
// ============================================
export type {
	PlanningAcceptance,
	PlanningAccount,
	PlanningApiMode,
	PlanningApiRequest,
	PlanningApiScenario,
	PlanningAuthState,
	PlanningContext,
	PlanningRealm,
	PlanningRuntime,
	PlanningScenario,
	PlanningSpaceOption,
	PlanningStatus,
} from "./storybook-planning";
// ============================================
// 테이블 관련 타입
// ============================================
export type {
	DataGridChangesSnapshot,
	DataGridChangesState,
	DataGridColumnConfig,
	DataGridColumnsState,
	DataGridColumnsStateSnapshot,
	DataGridConfig,
	DataGridEditableConfig,
	DataGridEditCellContext,
	DataGridQueryState,
	DataGridQueryStates,
	DataGridRowData,
	DataGridRowKey,
	DataGridRowMoveEvent,
	DataGridSelectionState,
	DataGridSetQueryStates,
	DataGridState,
	DataGridUpdatedRow,
	DropdownItem,
	InputConfig,
	InputHandlers,
	InputType,
	InputTypeProps,
	ResponsiveConfig,
	SelectionConfig,
	SelectOption,
} from "./table";
// ============================================
// 통계 관련 타입
// ============================================
export type { UserStats } from "./user-stats";

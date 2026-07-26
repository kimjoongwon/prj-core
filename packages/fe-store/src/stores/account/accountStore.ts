import { makeAutoObservable, reaction } from "mobx";
import type { PersistStorage } from "../persistence/persistStorage";
import type { AuthSession } from "./authSession";

const ACCOUNT_PERSIST_SECTION = "account";
const ACCOUNT_TENANT_SELECTION_PERSIST_VERSION = 2 as const;

/**
 * RootStore가 AccountStore를 조립할 때 제공하는 완성된 의존성입니다.
 */
export interface AccountStoreDependencies {
	authSession: AuthSession;
	persistStorage: PersistStorage;
}

export interface AccountSpaceInfo {
	tenantId: string;
	spaceId: string;
	fitnessCenterName: string;
	contentLanguageCode?: string | null;
}

interface PersistedAccountTenantSelection {
	version: typeof ACCOUNT_TENANT_SELECTION_PERSIST_VERSION;
	tenantId: string | null;
	spaceId: string | null;
	fitnessCenterName: string | null;
	contentLanguageCode: string | null;
	availableSpaces: AccountSpaceInfo[];
}

/**
 * AccountStore - 현재 로그인 계정의 인증 세션과 tenant/space 선택 상태를 관리합니다.
 */
export class AccountStore {
	readonly authSession: AuthSession;
	private readonly persistStorage: PersistStorage;
	currentTenantId: string | null = null;
	selectedTenantId: string | null = null;
	currentSpaceId: string | null = null;
	currentFitnessCenterName: string | null = null;
	contentLanguageCode: string | null = null;
	availableSpaces: AccountSpaceInfo[] = [];
	isHydrated = false;
	isSelectionResolved = false;

	constructor({ authSession, persistStorage }: AccountStoreDependencies) {
		this.authSession = authSession;
		this.persistStorage = persistStorage;

		makeAutoObservable<this, "authSession" | "persistStorage">(this, {
			authSession: false,
			persistStorage: false,
		});

		this.setupAutoSave();
	}

	/**
	 * 브라우저 저장소에 남아 있는 account 선택 상태를 한 번 복원합니다.
	 */
	hydrateFromStorage(): void {
		if (this.isHydrated) {
			return;
		}

		const persisted = this.readPersistedAccountTenantSelection();
		if (persisted) {
			this.currentTenantId = persisted.tenantId;
			this.selectedTenantId = persisted.tenantId;
			this.currentSpaceId = persisted.spaceId;
			this.currentFitnessCenterName = persisted.fitnessCenterName;
			this.contentLanguageCode = persisted.contentLanguageCode ?? null;
			this.availableSpaces = persisted.availableSpaces;
		}

		this.isHydrated = true;
	}

	/**
	 * 현재 계정이 접근 가능한 Space 목록을 갱신합니다.
	 */
	setAvailableSpaces(spaces: AccountSpaceInfo[]): void {
		this.availableSpaces = spaces;
	}

	/**
	 * 현재 tenant와 선택한 Space/FitnessCenter 정보를 동기화합니다.
	 */
	setCurrentTenant(
		tenantId: string,
		fitnessCenterName: string,
		contentLanguageCode?: string | null,
		spaceId?: string | null,
	): void {
		this.currentTenantId = tenantId;
		this.selectedTenantId = tenantId;
		const selectedSpace = this.availableSpaces.find(
			(space) => space.tenantId === tenantId,
		);
		this.currentSpaceId = spaceId ?? selectedSpace?.spaceId ?? null;
		this.currentFitnessCenterName = fitnessCenterName;
		this.contentLanguageCode =
			contentLanguageCode === undefined
				? (selectedSpace?.contentLanguageCode ?? null)
				: contentLanguageCode;
	}

	/**
	 * Space 선택 draft용 tenant를 갱신합니다.
	 */
	selectTenant(tenantId: string | null): void {
		this.selectedTenantId = tenantId;
	}

	/**
	 * 현재 확정된 tenant와 Space/FitnessCenter 선택을 초기화합니다.
	 */
	clearCurrentTenant(): void {
		this.currentTenantId = null;
		this.selectedTenantId = null;
		this.currentSpaceId = null;
		this.currentFitnessCenterName = null;
		this.contentLanguageCode = null;
	}

	/**
	 * Space 선택 완료 여부를 갱신합니다.
	 */
	setSelectionResolved(resolved: boolean): void {
		this.isSelectionResolved = resolved;
	}

	/**
	 * account 상태와 인증 세션을 모두 초기화합니다.
	 */
	clear(): void {
		this.authSession.clear();
		this.clearCurrentTenant();
		this.availableSpaces = [];
		this.isHydrated = true;
		this.isSelectionResolved = true;
		this.persistStorage.remove(ACCOUNT_PERSIST_SECTION);
	}

	private readPersistedAccountTenantSelection(): PersistedAccountTenantSelection | null {
		const data = this.persistStorage.read<unknown>(ACCOUNT_PERSIST_SECTION);
		if (data === null) {
			return null;
		}

		if (!isPersistedAccountTenantSelection(data)) {
			this.persistStorage.remove(ACCOUNT_PERSIST_SECTION);
			return null;
		}

		return {
			version: ACCOUNT_TENANT_SELECTION_PERSIST_VERSION,
			tenantId: typeof data.tenantId === "string" ? data.tenantId : null,
			spaceId: typeof data.spaceId === "string" ? data.spaceId : null,
			fitnessCenterName:
				typeof data.fitnessCenterName === "string"
					? data.fitnessCenterName
					: null,
			contentLanguageCode:
				typeof data.contentLanguageCode === "string"
					? data.contentLanguageCode
					: null,
			availableSpaces: normalizePersistedSpaces(data.availableSpaces),
		};
	}

	private setupAutoSave(): void {
		reaction(
			() => ({
				version: ACCOUNT_TENANT_SELECTION_PERSIST_VERSION,
				tenantId: this.currentTenantId,
				spaceId: this.currentSpaceId,
				fitnessCenterName: this.currentFitnessCenterName,
				contentLanguageCode: this.contentLanguageCode,
				availableSpaces: this.availableSpaces,
			}),
			(data) => {
				if (isEmptyPersistedAccountTenantSelection(data)) {
					this.persistStorage.remove(ACCOUNT_PERSIST_SECTION);
					return;
				}

				this.persistStorage.write(ACCOUNT_PERSIST_SECTION, data);
			},
		);
	}
}

function isPersistedRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function isPersistedAccountTenantSelection(
	value: unknown,
): value is PersistedAccountTenantSelection {
	return (
		isPersistedRecord(value) &&
		value.version === ACCOUNT_TENANT_SELECTION_PERSIST_VERSION
	);
}

function isEmptyPersistedAccountTenantSelection(
	data: PersistedAccountTenantSelection,
): boolean {
	return (
		data.version === ACCOUNT_TENANT_SELECTION_PERSIST_VERSION &&
		data.tenantId === null &&
		data.spaceId === null &&
		data.fitnessCenterName === null &&
		data.contentLanguageCode === null &&
		data.availableSpaces.length === 0
	);
}

function normalizePersistedSpaces(spaces?: unknown): AccountSpaceInfo[] {
	return Array.isArray(spaces)
		? spaces.filter(
				(space): space is AccountSpaceInfo =>
					typeof space?.tenantId === "string" &&
					typeof space?.spaceId === "string" &&
					typeof space?.fitnessCenterName === "string",
			)
		: [];
}

import { makeAutoObservable, reaction } from "mobx";
import type { PersistStorage } from "../persistence/persistStorage";
import type { AuthSession } from "./authSession";

const ACCOUNT_PERSIST_SECTION = "account";

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
	groundName: string;
	contentLanguageCode?: string | null;
}

interface PersistedAccountTenantSelection {
	tenantId: string | null;
	spaceId: string | null;
	groundName: string | null;
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
	currentGroundName: string | null = null;
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

	hydrateFromStorage(): void {
		if (this.isHydrated) {
			return;
		}

		const persisted = this.readPersistedAccountTenantSelection();
		if (persisted) {
			this.currentTenantId = persisted.tenantId;
			this.selectedTenantId = persisted.tenantId;
			this.currentSpaceId = persisted.spaceId;
			this.currentGroundName = persisted.groundName;
			this.contentLanguageCode = persisted.contentLanguageCode ?? null;
			this.availableSpaces = persisted.availableSpaces;
		}

		this.isHydrated = true;
	}

	setAvailableSpaces(spaces: AccountSpaceInfo[]): void {
		this.availableSpaces = spaces;
	}

	setCurrentTenant(
		tenantId: string,
		groundName: string,
		contentLanguageCode?: string | null,
		spaceId?: string | null,
	): void {
		this.currentTenantId = tenantId;
		this.selectedTenantId = tenantId;
		const selectedSpace = this.availableSpaces.find(
			(space) => space.tenantId === tenantId,
		);
		this.currentSpaceId = spaceId ?? selectedSpace?.spaceId ?? null;
		this.currentGroundName = groundName;
		this.contentLanguageCode =
			contentLanguageCode === undefined
				? (selectedSpace?.contentLanguageCode ?? null)
				: contentLanguageCode;
	}

	selectTenant(tenantId: string | null): void {
		this.selectedTenantId = tenantId;
	}

	clearCurrentTenant(): void {
		this.currentTenantId = null;
		this.selectedTenantId = null;
		this.currentSpaceId = null;
		this.currentGroundName = null;
		this.contentLanguageCode = null;
	}

	setSelectionResolved(resolved: boolean): void {
		this.isSelectionResolved = resolved;
	}

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
		if (!isPersistedRecord(data)) {
			return null;
		}

		return {
			tenantId: typeof data.tenantId === "string" ? data.tenantId : null,
			spaceId: typeof data.spaceId === "string" ? data.spaceId : null,
			groundName: typeof data.groundName === "string" ? data.groundName : null,
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
				tenantId: this.currentTenantId,
				spaceId: this.currentSpaceId,
				groundName: this.currentGroundName,
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

function isEmptyPersistedAccountTenantSelection(
	data: PersistedAccountTenantSelection,
): boolean {
	return (
		data.tenantId === null &&
		data.spaceId === null &&
		data.groundName === null &&
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
					typeof space?.groundName === "string",
			)
		: [];
}

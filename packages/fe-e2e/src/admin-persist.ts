import { type DecimalId, isDecimalId } from "@cocrepo/type";

const ADMIN_ACCOUNT_PERSIST_VERSION = 2 as const;

/** Admin 저장 문서의 native 인증 session 계약입니다. */
export interface AdminNativeAuthSession {
	accessToken: string;
	refreshToken: string;
	sessionId: string;
	accessTokenExpiresAt: number;
	refreshTokenExpiresAt: number;
}

/** Admin account section에 저장하는 Space/FitnessCenter 선택 계약입니다. */
export interface AdminPersistSpaceSelection {
	tenantId: DecimalId;
	spaceId: DecimalId;
	fitnessCenterName: string;
	contentLanguageCode?: string | null;
}

/** Admin account section의 현재 persist 계약입니다. */
export interface AdminPersistAccount {
	version: typeof ADMIN_ACCOUNT_PERSIST_VERSION;
	tenantId: DecimalId | null;
	spaceId: DecimalId | null;
	fitnessCenterName: string | null;
	contentLanguageCode: string | null;
	availableSpaces: AdminPersistSpaceSelection[];
}

/** RootStore가 하나의 localStorage key 아래 관리하는 Admin 저장 문서입니다. */
export interface AdminPersistStorageDocument {
	account?: AdminPersistAccount;
	authSession?: AdminNativeAuthSession;
	language?: unknown;
}

/**
 * localStorage JSON을 section 기반 Admin 저장 문서로 읽습니다.
 *
 * @param raw localStorage에 저장된 JSON 문자열
 * @returns 파싱 가능한 object 문서, 아니면 빈 문서
 */
export function parseAdminPersistStorageDocument(
	raw: string | null,
): AdminPersistStorageDocument {
	if (!raw) {
		return {};
	}

	try {
		const parsed = JSON.parse(raw) as unknown;
		if (!isRecord(parsed)) {
			return {};
		}

		const account = normalizeAdminPersistAccount(parsed.account);
		const authSession = normalizeAdminPersistAuthSession(parsed.authSession);

		return {
			...(account ? { account } : {}),
			...(authSession ? { authSession } : {}),
			...("language" in parsed ? { language: parsed.language } : {}),
		};
	} catch {
		return {};
	}
}

/**
 * Admin 저장 문서의 authSession section을 native 로그인 결과로 교체합니다.
 *
 * @param raw 기존 localStorage JSON
 * @param session native 로그인 API가 반환한 session
 * @returns 현재 section 계약으로 정규화된 저장 문서
 */
export function mergeAdminPersistAuthSession(
	raw: string | null,
	session: AdminNativeAuthSession,
): AdminPersistStorageDocument {
	return {
		...parseAdminPersistStorageDocument(raw),
		authSession: { ...session },
	};
}

/**
 * Admin 저장 문서의 account section을 선택한 FitnessCenter 기준으로 갱신합니다.
 *
 * @param raw 기존 localStorage JSON
 * @param selection 선택한 tenant/space/FitnessCenter
 * @returns account version 2 계약으로 정규화된 저장 문서
 */
export function mergeAdminPersistAccountSelection(
	raw: string | null,
	selection: AdminPersistSpaceSelection,
): AdminPersistStorageDocument {
	if (!isDecimalId(selection.tenantId) || !isDecimalId(selection.spaceId)) {
		throw new Error(
			"Admin persist selection requires canonical decimal tenant/space IDs.",
		);
	}

	const document = parseAdminPersistStorageDocument(raw);
	const currentAccount = normalizeAdminPersistAccount(document.account);
	const availableSpaces = [
		selection,
		...(currentAccount?.availableSpaces ?? []).filter(
			(space) => space.tenantId !== selection.tenantId,
		),
	];

	return {
		...document,
		account: {
			version: ADMIN_ACCOUNT_PERSIST_VERSION,
			tenantId: selection.tenantId,
			spaceId: selection.spaceId,
			fitnessCenterName: selection.fitnessCenterName,
			contentLanguageCode: selection.contentLanguageCode ?? null,
			availableSpaces,
		},
	};
}

/**
 * Admin 저장 문서에서 현재 tenant/space 선택값을 읽습니다.
 *
 * @param raw localStorage JSON
 * @returns canonical decimal ID를 가진 선택값, 없으면 undefined
 */
export function readAdminPersistSpaceSelection(
	raw: string | null,
): AdminPersistSpaceSelection | undefined {
	const account = parseAdminPersistStorageDocument(raw).account;
	if (!account?.tenantId || !account.spaceId || !account.fitnessCenterName) {
		return undefined;
	}

	return {
		tenantId: account.tenantId,
		spaceId: account.spaceId,
		fitnessCenterName: account.fitnessCenterName,
		contentLanguageCode: account.contentLanguageCode,
	};
}

/**
 * Admin 저장 문서에서 native access token을 읽습니다.
 *
 * @param raw localStorage JSON
 * @returns 유효한 access token, 없으면 undefined
 */
export function readAdminPersistAccessToken(
	raw: string | null,
): string | undefined {
	const authSession = parseAdminPersistStorageDocument(raw).authSession;
	return typeof authSession?.accessToken === "string" &&
		authSession.accessToken.length > 0
		? authSession.accessToken
		: undefined;
}

function normalizeAdminPersistAccount(
	value: unknown,
): AdminPersistAccount | null {
	if (!isRecord(value) || value.version !== ADMIN_ACCOUNT_PERSIST_VERSION) {
		return null;
	}

	return {
		version: ADMIN_ACCOUNT_PERSIST_VERSION,
		tenantId: isDecimalId(value.tenantId) ? value.tenantId : null,
		spaceId: isDecimalId(value.spaceId) ? value.spaceId : null,
		fitnessCenterName:
			typeof value.fitnessCenterName === "string"
				? value.fitnessCenterName
				: null,
		contentLanguageCode:
			typeof value.contentLanguageCode === "string"
				? value.contentLanguageCode
				: null,
		availableSpaces: normalizeAdminPersistSpaces(value.availableSpaces),
	};
}

function normalizeAdminPersistSpaces(
	value: unknown,
): AdminPersistSpaceSelection[] {
	return Array.isArray(value)
		? value.filter(
				(space): space is AdminPersistSpaceSelection =>
					isRecord(space) &&
					isDecimalId(space.tenantId) &&
					isDecimalId(space.spaceId) &&
					typeof space.fitnessCenterName === "string" &&
					(space.contentLanguageCode === undefined ||
						space.contentLanguageCode === null ||
						typeof space.contentLanguageCode === "string"),
			)
		: [];
}

function normalizeAdminPersistAuthSession(
	value: unknown,
): AdminNativeAuthSession | null {
	if (
		!isRecord(value) ||
		typeof value.accessToken !== "string" ||
		typeof value.refreshToken !== "string" ||
		typeof value.sessionId !== "string" ||
		typeof value.accessTokenExpiresAt !== "number" ||
		typeof value.refreshTokenExpiresAt !== "number"
	) {
		return null;
	}

	return {
		accessToken: value.accessToken,
		refreshToken: value.refreshToken,
		sessionId: value.sessionId,
		accessTokenExpiresAt: value.accessTokenExpiresAt,
		refreshTokenExpiresAt: value.refreshTokenExpiresAt,
	};
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

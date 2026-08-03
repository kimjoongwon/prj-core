import { type DecimalId, isDecimalId } from "@cocrepo/type";
import type { AdminPersistSpaceSelection } from "./admin-persist";

/** Admin Space bootstrap API 응답을 읽는 최소 response 계약입니다. */
export interface AdminSpaceApiResponseLike {
	status(): number;
	json(): Promise<unknown>;
}

/** Admin Space bootstrap API를 호출하는 최소 request 계약입니다. */
export interface AdminSpaceApiRequestLike {
	get(
		url: string,
		options?: { headers?: Record<string, string> },
	): Promise<AdminSpaceApiResponseLike>;
	post(
		url: string,
		options?: {
			data?: unknown;
			headers?: Record<string, string>;
		},
	): Promise<AdminSpaceApiResponseLike>;
}

/** Admin Space 선택 bootstrap 옵션입니다. */
export interface BootstrapAdminSpaceSelectionOptions {
	apiBaseUrl: string;
	accessToken: string;
	fitnessCenterName?: string;
}

interface AdminSpaceResponseData {
	id: DecimalId;
	tenantId: DecimalId;
	contentLanguageCode: string | null;
	fitnessCenterName: string;
}

const DEFAULT_FITNESS_CENTER_NAME = "플랫폼 운영본부";

/**
 * 로그인 session으로 접근 가능한 Space를 조회하고 대상 Tenant를 current-space로 선택합니다.
 *
 * @param request Playwright APIRequestContext와 호환되는 request client
 * @param options API base URL, access token, 선택할 FitnessCenter 이름
 * @returns API 응답에서 동적으로 얻은 canonical tenant/space 선택값
 */
export async function bootstrapAdminSpaceSelection(
	request: AdminSpaceApiRequestLike,
	options: BootstrapAdminSpaceSelectionOptions,
): Promise<AdminPersistSpaceSelection> {
	const authorizationHeaders = {
		Authorization: `Bearer ${options.accessToken}`,
	};
	const mySpacesResponse = await request.get(
		buildApiUrl(options.apiBaseUrl, "/api/v1/auth/my-spaces"),
		{ headers: authorizationHeaders },
	);

	if (mySpacesResponse.status() !== 200) {
		throw new Error(
			`Admin Space bootstrap failed: ${mySpacesResponse.status()}`,
		);
	}

	const mySpacesPayload = (await mySpacesResponse.json()) as {
		data?: unknown;
	};
	if (!Array.isArray(mySpacesPayload.data)) {
		throw new Error("Admin Space bootstrap response is invalid.");
	}

	const fitnessCenterName =
		options.fitnessCenterName ?? DEFAULT_FITNESS_CENTER_NAME;
	const bootstrapSpace = mySpacesPayload.data.find(
		(value) => readFitnessCenterName(value) === fitnessCenterName,
	);
	if (!bootstrapSpace) {
		throw new Error(
			`Admin Space bootstrap did not include FitnessCenter: ${fitnessCenterName}`,
		);
	}
	const bootstrapSelection = parseAdminSpaceResponseData(
		bootstrapSpace,
		"Admin Space bootstrap",
	);

	const currentSpaceResponse = await request.post(
		buildApiUrl(options.apiBaseUrl, "/api/v1/auth/current-space"),
		{
			data: { tenantId: bootstrapSelection.tenantId },
			headers: authorizationHeaders,
		},
	);
	if (currentSpaceResponse.status() !== 200) {
		throw new Error(
			`Admin current-space selection failed: ${currentSpaceResponse.status()}`,
		);
	}

	const currentSpacePayload = (await currentSpaceResponse.json()) as {
		data?: unknown;
	};
	const selectedSpace = parseAdminSpaceResponseData(
		currentSpacePayload.data,
		"Admin current-space selection",
	);
	if (
		selectedSpace.tenantId !== bootstrapSelection.tenantId ||
		selectedSpace.id !== bootstrapSelection.id
	) {
		throw new Error(
			"Admin current-space selection did not match the bootstrap Space.",
		);
	}

	return {
		tenantId: selectedSpace.tenantId,
		spaceId: selectedSpace.id,
		fitnessCenterName: selectedSpace.fitnessCenterName,
		contentLanguageCode: selectedSpace.contentLanguageCode,
	};
}

function buildApiUrl(apiBaseUrl: string, path: string) {
	return new URL(path, ensureTrailingSlash(apiBaseUrl)).toString();
}

function ensureTrailingSlash(value: string) {
	return value.endsWith("/") ? value : `${value}/`;
}

function parseAdminSpaceResponseData(
	value: unknown,
	source: string,
): AdminSpaceResponseData {
	if (!isRecord(value)) {
		throw new Error(`${source} response data is invalid.`);
	}

	if (!isDecimalId(value.id) || !isDecimalId(value.tenantId)) {
		throw new Error(`${source} returned a non-canonical decimal ID.`);
	}

	const fitnessCenterName = readFitnessCenterName(value);
	if (!fitnessCenterName) {
		throw new Error(`${source} response is missing its FitnessCenter name.`);
	}

	return {
		id: value.id,
		tenantId: value.tenantId,
		contentLanguageCode:
			typeof value.contentLanguageCode === "string"
				? value.contentLanguageCode
				: null,
		fitnessCenterName,
	};
}

function readFitnessCenterName(value: unknown) {
	if (!isRecord(value) || !isRecord(value.fitnessCenter)) {
		return undefined;
	}

	return typeof value.fitnessCenter.name === "string"
		? value.fitnessCenter.name
		: undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

import { isDecimalId } from "@cocrepo/type";
import { readAdminPersistSpaceSelection } from "./admin-persist";
import { getAdminRequestHeaders } from "./admin-request-headers";
import {
	findAdminPersistRaw,
	readAdminStorageState,
} from "./admin-storage-state";

/**
 * Admin API 요청용 인증 및 tenant scope header를 만듭니다.
 *
 * @param tenantId API bootstrap 결과의 tenant ID. 생략하면 storage state의 동적 선택값을 사용합니다.
 * @param headers 추가 또는 override할 header
 * @returns Admin API 요청 header
 */
export function getAdminSpaceRequestHeaders(
	tenantId?: string,
	headers: Record<string, string> = {},
) {
	const resolvedTenantId =
		headers["x-tenant-id"] ?? tenantId ?? readSelectedTenantId();
	if (!isDecimalId(resolvedTenantId)) {
		throw new Error("x-tenant-id must be a canonical decimal ID.");
	}

	return getAdminRequestHeaders({
		...headers,
		"x-tenant-id": resolvedTenantId,
	});
}

function readSelectedTenantId() {
	const storageState = readAdminStorageState();
	const selection = readAdminPersistSpaceSelection(
		findAdminPersistRaw(storageState) ?? null,
	);
	if (!selection) {
		throw new Error(
			"Admin E2E storage state does not contain a canonical tenant/space selection.",
		);
	}

	return selection.tenantId;
}

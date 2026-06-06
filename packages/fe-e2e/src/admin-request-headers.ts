import { getAdminAccessToken } from "./admin-access-token";

export function getAdminRequestHeaders(headers: Record<string, string> = {}) {
	return {
		...headers,
		Authorization: headers.Authorization ?? `Bearer ${getAdminAccessToken()}`,
	};
}

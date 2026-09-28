import type { InteractionDataDto } from "@cocrepo/api/idp/model";
import { headers } from "next/headers";

/**
 * interaction 상태를 idp-api에서 서버 사이드로 조회한다.
 *
 * fe-api의 getInteraction()은 서버에서 상대경로를 CORE_API_INTERNAL_URL(core-api)로
 * 조립하므로 여기서는 쓸 수 없다 — idp-api 내부 주소로 직접 호출한다.
 * 브라우저가 보낸 Cookie 헤더를 그대로 전달해야 oidc-provider가 _interaction
 * 쿠키로 트랜잭션을 식별할 수 있다(읽기 전용 조회라 Set-Cookie 되돌리기는 없다).
 */
const IDP_API_INTERNAL_URL =
	process.env.IDP_API_INTERNAL_URL ?? "http://localhost:3007";

export type InteractionDataResult =
	| { status: "ok"; data: InteractionDataDto }
	| { status: "expired"; message: string }
	| { status: "error"; message: string };

const EXPIRED_INTERACTION_MESSAGE =
	"인증 세션이 만료되었거나 더 이상 유효하지 않습니다. 다시 로그인해 주세요.";

export async function fetchInteractionData(
	uid: string,
): Promise<InteractionDataResult> {
	const cookieHeader = (await headers()).get("cookie") ?? "";

	try {
		const response = await fetch(
			`${IDP_API_INTERNAL_URL}/api/interaction/${encodeURIComponent(uid)}`,
			{
				cache: "no-store",
				headers: { cookie: cookieHeader },
			},
		);

		if (response.ok) {
			return {
				status: "ok",
				data: (await response.json()) as InteractionDataDto,
			};
		}

		if (response.status === 400 || response.status === 404) {
			return { status: "expired", message: EXPIRED_INTERACTION_MESSAGE };
		}

		return {
			status: "error",
			message: "인증 정보를 불러오는 중 오류가 발생했습니다.",
		};
	} catch {
		return {
			status: "error",
			message: "서버와 통신할 수 없습니다. 잠시 후 다시 시도해 주세요.",
		};
	}
}

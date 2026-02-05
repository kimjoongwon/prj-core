import { RootStore } from "./rootStore";

/**
 * TokenStore
 *
 * HttpOnly 쿠키 환경에서는 프론트엔드가 토큰에 직접 접근하지 않습니다.
 * 토큰 만료 시간 관리는 PersistStore가 담당합니다.
 * 토큰 갱신은 customAxios 인터셉터가 401 응답 시 자동 처리합니다.
 */
export class TokenStore {
	readonly rootStore: RootStore;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
	}
}

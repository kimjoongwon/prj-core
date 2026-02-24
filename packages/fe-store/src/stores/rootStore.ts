import { makeAutoObservable } from "mobx";
import { AbilityStore } from "./abilityStore";
import { AlbumStore } from "./albumStore";
import { AssetStore } from "./assetStore";
import { AuthStore } from "./authStore";
import { BottomTabStore } from "./bottomTabStore";
import { CookieStore } from "./cookieStore";
import { ExerciseStore } from "./exerciseStore";
import { FABStore } from "./fabStore";
import { GroundStore } from "./groundStore";
import { NavigationStore } from "./navigationStore";
import type { Navigator } from "./navigator";
import { PersistStore } from "./persistStore";
import { ProgramStore } from "./programStore";
import { ReservationStore } from "./reservationStore";
import { TimelineStore } from "./timelineStore";
import { TokenStore } from "./tokenStore";

/**
 * RootStore - 모든 하위 Store를 관리하는 최상위 Store
 *
 * RootStore는 순수 컨테이너로, 내부에서 Store를 생성하지 않습니다.
 * 각 앱에서 필요한 Store를 인스턴스화하여 주입합니다.
 *
 * @example
 * ```typescript
 * // 앱에서 Store 생성 및 주입
 * const rootStore = new RootStore();
 * rootStore.navigator = new Navigator({ router });
 * rootStore.tokenStore = new TokenStore(rootStore);
 * rootStore.cookieStore = new CookieStore();
 * rootStore.authStore = new AuthStore(rootStore);
 * rootStore.navigationStore = new NavigationStore(MENU_CONFIG, { navigator: rootStore.navigator });
 *
 * // v7.0 신규: 모바일 지원
 * rootStore.fabStore = new FABStore(FAB_CONFIG);
 * rootStore.bottomTabStore = new BottomTabStore(BOTTOM_TAB_CONFIG, { navigationStore: rootStore.navigationStore });
 *
 * // Asset 관리
 * rootStore.assetStore = new AssetStore(rootStore);
 *
 * // Album 관리
 * rootStore.albumStore = new AlbumStore(rootStore);
 *
 * // 도메인 Store들
 * rootStore.timelineStore = new TimelineStore();
 * rootStore.groundStore = new GroundStore();
 * rootStore.exerciseStore = new ExerciseStore();
 * rootStore.programStore = new ProgramStore();
 * rootStore.reservationStore = new ReservationStore(rootStore);
 * ```
 *
 * Store Tree 구조 (앱에 따라 다름):
 * RootStore
 * ├── navigator (Navigator) - 페이지 이동 담당
 * ├── navigationStore (NavigationStore) - 메뉴 및 네비게이션 관리
 * ├── tokenStore (TokenStore) - 토큰 관리
 * ├── cookieStore (CookieStore) - 쿠키 관리
 * ├── authStore (AuthStore) - 인증 상태 관리
 * ├── persistStore (PersistStore) - 영속 저장 관리
 * ├── abilityStore (AbilityStore) - 권한 관리
 * ├── fabStore (FABStore) - v7.0: FAB 상태 관리
 * ├── bottomTabStore (BottomTabStore) - v7.0: BottomTab 상태 관리
 * ├── assetStore (AssetStore) - 에셋 관리 UI 상태
 * ├── albumStore (AlbumStore) - 앨범 관리 UI 상태
 * ├── timelineStore (TimelineStore) - 타임라인 목록 UI 상태
 * ├── groundStore (GroundStore) - 시설 목록 UI 상태
 * ├── exerciseStore (ExerciseStore) - 운동 종목 목록 UI 상태
 * ├── programStore (ProgramStore) - 프로그램 관련 UI 상태
 * └── reservationStore (ReservationStore) - 예약 관리 UI 상태
 */
export class RootStore {
	name: string = "PROTOTYPE";

	// 각 Store는 외부에서 주입됨
	navigator?: Navigator;
	navigationStore?: NavigationStore;
	tokenStore?: TokenStore;
	authStore?: AuthStore;
	cookieStore?: CookieStore;
	persistStore?: PersistStore;
	abilityStore?: AbilityStore;
	/** v7.0 신규: FAB 상태 관리 */
	fabStore?: FABStore;
	/** v7.0 신규: BottomTab 상태 관리 */
	bottomTabStore?: BottomTabStore;
	/** 에셋 관리 UI 상태 */
	assetStore?: AssetStore;
	/** 앨범 관리 UI 상태 */
	albumStore?: AlbumStore;
	/** 타임라인 목록 UI 상태 */
	timelineStore?: TimelineStore;
	/** 시설 목록 UI 상태 */
	groundStore?: GroundStore;
	/** 운동 종목 목록 UI 상태 */
	exerciseStore?: ExerciseStore;
	/** 프로그램 관련 UI 상태 */
	programStore?: ProgramStore;
	/** 예약 관리 UI 상태 */
	reservationStore?: ReservationStore;

	constructor() {
		makeAutoObservable(this);
	}
}

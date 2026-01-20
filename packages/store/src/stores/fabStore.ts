import type { FABAction } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";
import type { Navigator } from "./navigator";

/**
 * FAB 액션 설정 인터페이스 (생성자 파라미터용)
 */
export interface FABConfig {
	actions: FABAction[];
}

/**
 * 권한 체크 함수 타입
 */
export type FABAbilityChecker = (action: string, subject: string) => boolean;

/**
 * 모달 열기 핸들러 타입
 */
export type ModalOpenHandler = (modalId: string) => void;

export interface FABStoreOptions {
	/** Navigator 인스턴스 - 페이지 이동 담당 */
	navigator?: Navigator;
	/** 권한 체크 함수 */
	abilityChecker?: FABAbilityChecker;
	/** 모달 열기 핸들러 */
	onModalOpen?: ModalOpenHandler;
}

/**
 * FABStore - 모바일 FAB(Floating Action Button) 상태 관리
 *
 * 역할:
 * - FAB 열림/닫힘 상태 관리
 * - FAB 액션 목록 관리
 * - 권한 기반 액션 필터링
 * - 액션 실행 (페이지 이동 또는 모달 열기)
 *
 * @example
 * ```ts
 * const fabStore = new FABStore({
 *   actions: [
 *     { id: 'todayReservation', label: '오늘 예약', icon: 'CalendarCheck', subject: 'quickAction:todayReservation', href: '/reservations/today' },
 *     { id: 'quickReservation', label: '빠른 예약', icon: 'CalendarPlus', subject: 'quickAction:quickReservation', modal: 'quickReservation' },
 *   ],
 * });
 *
 * fabStore.toggle(); // FAB 열기/닫기
 * fabStore.executeAction('todayReservation'); // 액션 실행
 * ```
 */
export class FABStore {
	private _isOpen: boolean = false;
	private readonly _actions: FABAction[];
	private _abilityChecker: FABAbilityChecker | null = null;
	private _navigator: Navigator | null = null;
	private _onModalOpen: ModalOpenHandler | null = null;

	constructor(config: FABConfig, options?: FABStoreOptions) {
		this._actions = config.actions;
		this._navigator = options?.navigator ?? null;
		this._abilityChecker = options?.abilityChecker ?? null;
		this._onModalOpen = options?.onModalOpen ?? null;

		makeAutoObservable(this);
	}

	/**
	 * Navigator 설정
	 */
	setNavigator(navigator: Navigator): void {
		this._navigator = navigator;
	}

	/**
	 * 권한 체크 함수 설정
	 */
	setAbilityChecker(checker: FABAbilityChecker): void {
		this._abilityChecker = checker;
	}

	/**
	 * 모달 열기 핸들러 설정
	 */
	setModalOpenHandler(handler: ModalOpenHandler): void {
		this._onModalOpen = handler;
	}

	/**
	 * FAB 열림 상태
	 */
	get isOpen(): boolean {
		return this._isOpen;
	}

	/**
	 * 전체 액션 목록 (필터링 없음)
	 */
	get allActions(): FABAction[] {
		return this._actions;
	}

	/**
	 * 권한 필터링된 액션 목록
	 */
	get visibleActions(): FABAction[] {
		if (!this._abilityChecker) {
			return this._actions;
		}

		return this._actions.filter((action) =>
			this._abilityChecker!("ACCESS", action.subject),
		);
	}

	/**
	 * FAB 토글
	 */
	toggle(): void {
		this._isOpen = !this._isOpen;
	}

	/**
	 * FAB 열기
	 */
	open(): void {
		this._isOpen = true;
	}

	/**
	 * FAB 닫기
	 */
	close(): void {
		this._isOpen = false;
	}

	/**
	 * 액션 실행
	 * @param actionId 실행할 액션 ID
	 */
	executeAction(actionId: string): void {
		const action = this._actions.find((a) => a.id === actionId);
		if (!action) return;

		// 권한 체크
		if (
			this._abilityChecker &&
			!this._abilityChecker("ACCESS", action.subject)
		) {
			return;
		}

		// 페이지 이동
		if (action.href && this._navigator) {
			this._navigator.push(action.href);
			this.close();
			return;
		}

		// 모달 열기
		if (action.modal && this._onModalOpen) {
			this._onModalOpen(action.modal);
			this.close();
			return;
		}
	}

	/**
	 * ID로 액션 찾기
	 */
	findActionById(actionId: string): FABAction | undefined {
		return this._actions.find((action) => action.id === actionId);
	}
}

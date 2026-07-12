import { makeAutoObservable } from "mobx";
import { ModalState } from "./modalState";
import type { OpenModalOptions } from "./types";

/** 앱 전역에서 단일 활성 Modal의 생명주기를 관리합니다. */
export class ModalStore {
	current: ModalState<object> | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	/**
	 * 전달받은 도메인 state와 content로 새 Modal을 엽니다.
	 * 이미 열린 Modal은 callback 없이 교체합니다.
	 */
	open<TContentState extends object>(
		options: OpenModalOptions<TContentState>,
	): ModalState<TContentState> {
		this.dismiss();

		const modalState = new ModalState(options, (state) => {
			this.closeState(state as unknown as ModalState<object>);
		});
		this.current = modalState as unknown as ModalState<object>;

		return modalState;
	}

	/** 활성 Modal을 callback 없이 정리합니다. */
	dismiss(): void {
		const current = this.current;
		if (!current) {
			return;
		}

		this.current = null;
		current.deactivate();
	}

	/** 동일한 활성 state의 close 요청만 처리합니다. */
	private closeState(state: ModalState<object>): void {
		if (this.current !== state) {
			return;
		}

		this.current = null;
		state.deactivate();
		state.notifyClose();
	}
}

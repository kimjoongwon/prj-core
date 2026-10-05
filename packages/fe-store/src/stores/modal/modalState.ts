import { makeAutoObservable } from "mobx";
import type { ModalContent, OpenModalOptions } from "./types";

type CloseModal<TContentState extends object> = (
	state: ModalState<TContentState>,
) => void;

/**
 * 현재 열린 Modal의 content와 도메인 상태를 함께 보관합니다.
 *
 * @example
 * ```ts
 * modalState.close();
 * ```
 */
export class ModalState<TContentState extends object> {
	readonly title: OpenModalOptions<TContentState>["title"];
	readonly contentState: TContentState;
	readonly content: ModalContent<TContentState>;
	isOpen = true;
	private readonly onClose?: OpenModalOptions<TContentState>["onClose"];
	private readonly closeModal: CloseModal<TContentState>;

	constructor(
		options: OpenModalOptions<TContentState>,
		closeModal: CloseModal<TContentState>,
	) {
		this.title = options.title;
		this.contentState = options.state;
		this.content = options.content;
		this.onClose = options.onClose;
		this.closeModal = closeModal;

		makeAutoObservable<this, "closeModal" | "onClose">(this, {
			closeModal: false,
			content: false,
			contentState: false,
			onClose: false,
			title: false,
		});
	}

	/** 현재 Modal을 닫도록 owner ModalStore에 요청합니다. */
	close(): void {
		this.closeModal(this);
	}

	/** @internal ModalStore가 현재 상태를 비활성화합니다. */
	deactivate(): void {
		this.isOpen = false;
	}

	/** @internal 닫힘 callback에 동일한 ModalState를 전달합니다. */
	notifyClose(): void {
		this.onClose?.(this);
	}
}

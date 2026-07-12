import type { ComponentType, ReactNode } from "react";
import type { ModalState } from "./modalState";

/** Modal content component가 전달받는 공통 속성입니다. */
export interface ModalContentProps<TContentState extends object> {
	state: ModalState<TContentState>;
}

/** Modal body를 component 또는 render callback으로 제공하는 계약입니다. */
export type ModalContent<TContentState extends object> =
	| {
			kind: "component";
			component: ComponentType<ModalContentProps<TContentState>>;
	  }
	| {
			kind: "render";
			render: (state: ModalState<TContentState>) => ReactNode;
	  };

/** 새 Modal을 여는 데 필요한 상태와 content 계약입니다. */
export interface OpenModalOptions<TContentState extends object> {
	title: ReactNode;
	state: TContentState;
	content: ModalContent<TContentState>;
	onClose?: (state: ModalState<TContentState>) => void;
}

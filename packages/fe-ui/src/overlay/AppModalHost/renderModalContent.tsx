import type { ModalState } from "@cocrepo/store";
import type { ReactNode } from "react";

/** 판별된 content 계약에 따라 동일한 ModalState를 전달합니다. */
export function renderModalContent(state: ModalState<object>): ReactNode {
	if (state.content.kind === "component") {
		const Content = state.content.component;
		return <Content state={state} />;
	}

	return state.content.render(state);
}

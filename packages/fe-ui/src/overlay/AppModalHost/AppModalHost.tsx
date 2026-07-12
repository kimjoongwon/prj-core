"use client";

import { useApp } from "@cocrepo/store";
import { Modal, useOverlayState } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";
import { renderModalContent } from "./renderModalContent";

/** 앱 전역 Modal shell과 현재 content를 렌더링합니다. */
export const AppModalHost = observer(function AppModalHost() {
	const modal = useApp().modal;
	const current = modal.current;
	const t = useT();
	const overlayState = useOverlayState({
		isOpen: current?.isOpen ?? false,
		onOpenChange: (isOpen) => {
			if (!isOpen) {
				current?.close();
			}
		},
	});

	if (!current) {
		return null;
	}

	return (
		<Modal state={overlayState}>
			{/* HeroUI Modal root는 controlled 상태에서도 trigger slot을 요구합니다. */}
			<Modal.Trigger className="hidden" aria-hidden="true" tabIndex={-1} />
			<Modal.Backdrop
				onClick={(event) => {
					if (event.target === event.currentTarget) {
						current.close();
					}
				}}
			>
				<Modal.Container>
					<Modal.Dialog>
						<Modal.Header>
							{typeof current.title === "string"
								? t(current.title)
								: current.title}
						</Modal.Header>
						<Modal.Body>{renderModalContent(current)}</Modal.Body>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
});

AppModalHost.displayName = "AppModalHost";

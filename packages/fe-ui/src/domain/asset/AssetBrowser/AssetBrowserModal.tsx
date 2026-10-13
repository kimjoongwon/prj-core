"use client";

import { Modal, Spinner, useOverlayState } from "@heroui/react";
import { type ReactNode, Suspense } from "react";

export interface AssetBrowserModalProps {
	title: string;
	isOpen: boolean;
	onClose?: () => void;
	children: ReactNode;
}

/** 폼을 유지하면서 열린 모달의 에셋 조회만 Suspense로 대기합니다. */
export function AssetBrowserModal({
	title,
	isOpen,
	onClose,
	children,
}: AssetBrowserModalProps) {
	const modalState = useOverlayState({
		isOpen,
		onOpenChange: (isOpen) => {
			if (!isOpen) {
				onClose?.();
			}
		},
	});

	return (
		<Modal state={modalState}>
			<Modal.Backdrop>
				<Modal.Container size="full" scroll="inside">
					<Modal.Dialog aria-label={title}>
						<Modal.Body className="pt-0 pb-6">
							<Suspense
								fallback={
									<div className="flex min-h-64 items-center justify-center">
										<Spinner />
									</div>
								}
							>
								{isOpen ? children : null}
							</Suspense>
						</Modal.Body>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}

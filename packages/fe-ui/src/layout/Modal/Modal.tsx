import {
	Modal as BaseModal,
	ModalBody,
	type ModalBodyProps,
	ModalContent,
	ModalFooter,
	type ModalFooterProps,
	ModalHeader,
	type ModalHeaderProps,
	type ModalProps,
} from "../../design-system/primitives";

export interface ModalLayoutProps extends ModalProps {
	/** 모달 헤더 props */
	modalHeader?: ModalHeaderProps;
	/** 모달 본문 props */
	modalBody?: ModalBodyProps;
	/** 모달 푸터 props */
	modalFooter?: ModalFooterProps;
}

/**
 * Modal 컴포넌트
 * HeroUI Modal을 래핑한 레이아웃 컴포넌트입니다.
 * 헤더/본문/푸터 영역을 props로 분리하여 관리합니다.
 *
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   modalHeader={{ children: "모달 제목" }}
 *   modalBody={{ children: <p>모달 내용</p> }}
 *   modalFooter={{ children: <Button onPress={handleClose}>닫기</Button> }}
 * />
 * ```
 */
export const Modal = (props: ModalLayoutProps) => {
	const { modalHeader, modalBody, modalFooter, ...modalProps } = props;

	return (
		<BaseModal
			isOpen={true}
			onClose={() => {}}
			scrollBehavior="inside"
			size="5xl"
			{...modalProps}
		>
			<ModalContent>
				<ModalHeader {...modalHeader}>{modalHeader?.children}</ModalHeader>
				<ModalBody {...modalBody}>{modalBody?.children}</ModalBody>
				<ModalFooter {...modalFooter}>{modalFooter?.children}</ModalFooter>
			</ModalContent>
		</BaseModal>
	);
};

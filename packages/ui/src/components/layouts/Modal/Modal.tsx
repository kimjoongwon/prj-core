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
} from "@heroui/react";

interface ModalLayoutProps extends ModalProps {
	modalHeader?: ModalHeaderProps;
	modalBody?: ModalBodyProps;
	modalFooter?: ModalFooterProps;
}

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

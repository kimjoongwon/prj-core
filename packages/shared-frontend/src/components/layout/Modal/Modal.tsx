import {
	Modal as BaseModal,
	ModalBody,
	ModalBodyProps,
	ModalContent,
	ModalFooter,
	ModalFooterProps,
	ModalHeader,
	ModalHeaderProps,
	ModalProps,
} from "@heroui/react";
import { observer } from "mobx-react-lite";

interface ModalLayoutProps extends ModalProps {
	modalHeader?: ModalHeaderProps;
	modalBody?: ModalBodyProps;
	modalFooter?: ModalFooterProps;
}

export const Modal = observer((props: ModalLayoutProps) => {
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
});

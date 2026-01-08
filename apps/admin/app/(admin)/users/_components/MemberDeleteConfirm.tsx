"use client";

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import type { Member } from "../_stores";

interface MemberDeleteConfirmProps {
	isOpen: boolean;
	member: Member | null;
	onClose: () => void;
	onConfirm: (memberId: string) => Promise<void>;
}

/**
 * 회원 삭제 확인 모달
 */
export function MemberDeleteConfirm({
	isOpen,
	member,
	onClose,
	onConfirm,
}: MemberDeleteConfirmProps) {
	const [isDeleting, setIsDeleting] = useState(false);

	// 삭제 확인 핸들러
	const handleConfirm = async () => {
		if (!member) return;

		setIsDeleting(true);
		try {
			await onConfirm(member.id);
			onClose();
		} catch {
			// 에러는 부모 컴포넌트에서 처리
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="md">
			<ModalContent>
				<ModalHeader className="flex items-center gap-2">
					<AlertTriangle className="h-5 w-5 text-danger" />
					<span className="text-lg font-semibold">회원 삭제</span>
				</ModalHeader>
				<ModalBody>
					<span className="text-default-600">
						<span className="font-medium">
							{member?.name}
						</span>
						<span> 회원을 정말 삭제하시겠습니까?</span>
					</span>
					<span className="text-sm text-default-500">
						이 작업은 되돌릴 수 없습니다. 회원의 모든 데이터가 삭제됩니다.
					</span>
				</ModalBody>
				<ModalFooter>
					<Button variant="light" onPress={onClose} isDisabled={isDeleting}>
						<span>취소</span>
					</Button>
					<Button color="danger" onPress={handleConfirm} isLoading={isDeleting}>
						<span>삭제</span>
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

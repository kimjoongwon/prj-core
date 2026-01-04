"use client";

import { Text } from "@cocrepo/ui";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
} from "@heroui/react";
import { Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import type { Member } from "../_stores";

// 역할 옵션
const ROLE_OPTIONS = [
	{ value: "USER", label: "회원" },
	{ value: "ADMIN", label: "관리자" },
];

// 폼 데이터 타입
interface MemberEditFormData {
	name: string;
	email: string;
	phone: string;
	role: string;
}

// 폼 에러 타입
interface FormErrors {
	name?: string;
	email?: string;
	phone?: string;
	role?: string;
}

interface MemberEditModalProps {
	isOpen: boolean;
	member: Member | null;
	onClose: () => void;
	onSubmit: (memberId: string, data: MemberEditFormData) => Promise<void>;
}

// 이메일 유효성 검사
const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

// 전화번호 유효성 검사 (한국 휴대폰)
const isValidPhone = (phone: string): boolean => {
	const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
	return phoneRegex.test(phone.replace(/-/g, ""));
};

/**
 * 회원 수정 모달
 */
export function MemberEditModal({
	isOpen,
	member,
	onClose,
	onSubmit,
}: MemberEditModalProps) {
	const [formData, setFormData] = useState<MemberEditFormData>({
		name: "",
		email: "",
		phone: "",
		role: "USER",
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// 회원 데이터가 변경되면 폼 데이터 업데이트
	useEffect(() => {
		if (member) {
			const roleName = member.tenants?.[0]?.role?.name || "USER";
			setFormData({
				name: member.name,
				email: member.email,
				phone: member.phone || "",
				role: roleName,
			});
		}
	}, [member]);

	// 입력값 변경 핸들러
	const handleChange = (field: keyof MemberEditFormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// 에러 클리어
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	// 역할 변경 핸들러
	const handleRoleChange = (keys: "all" | Set<React.Key>) => {
		if (keys === "all") return;
		const selectedValue = Array.from(keys)[0];
		if (selectedValue) {
			handleChange("role", String(selectedValue));
		}
	};

	// 폼 유효성 검사
	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		// 이름 검사
		if (!formData.name.trim()) {
			newErrors.name = "이름을 입력해주세요.";
		} else if (formData.name.length < 2 || formData.name.length > 50) {
			newErrors.name = "이름은 2~50자 사이여야 합니다.";
		}

		// 이메일 검사
		if (!formData.email.trim()) {
			newErrors.email = "이메일을 입력해주세요.";
		} else if (!isValidEmail(formData.email)) {
			newErrors.email = "유효한 이메일 형식이 아닙니다.";
		}

		// 전화번호 검사
		if (!formData.phone.trim()) {
			newErrors.phone = "전화번호를 입력해주세요.";
		} else if (!isValidPhone(formData.phone)) {
			newErrors.phone = "유효한 휴대폰 번호 형식이 아닙니다.";
		}

		// 역할 검사
		if (!formData.role) {
			newErrors.role = "역할을 선택해주세요.";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// 폼 제출 핸들러
	const handleSubmit = async () => {
		if (!member || !validateForm()) return;

		setIsSubmitting(true);
		try {
			await onSubmit(member.id, formData);
			handleClose();
		} catch {
			// 에러는 부모 컴포넌트에서 처리
		} finally {
			setIsSubmitting(false);
		}
	};

	// 모달 닫기 핸들러
	const handleClose = () => {
		setErrors({});
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size="lg"
			scrollBehavior="inside"
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					<Text className="text-xl font-semibold">회원 정보 수정</Text>
					<Text className="text-sm text-default-500">
						회원 정보를 수정합니다. (회원번호: #{member?.seq})
					</Text>
				</ModalHeader>
				<ModalBody className="gap-4">
					{/* 이름 */}
					<Input
						label="이름"
						placeholder="홍길동"
						value={formData.name}
						onValueChange={(value) => handleChange("name", value)}
						isInvalid={!!errors.name}
						errorMessage={errors.name}
						isRequired
						startContent={<User className="h-4 w-4 text-default-400" />}
					/>

					{/* 이메일 */}
					<Input
						type="email"
						label="이메일"
						placeholder="example@email.com"
						value={formData.email}
						onValueChange={(value) => handleChange("email", value)}
						isInvalid={!!errors.email}
						errorMessage={errors.email}
						isRequired
						startContent={<Mail className="h-4 w-4 text-default-400" />}
					/>

					{/* 전화번호 */}
					<Input
						type="tel"
						label="전화번호"
						placeholder="010-1234-5678"
						value={formData.phone}
						onValueChange={(value) => handleChange("phone", value)}
						isInvalid={!!errors.phone}
						errorMessage={errors.phone}
						isRequired
						startContent={<Phone className="h-4 w-4 text-default-400" />}
					/>

					{/* 역할 */}
					<Select
						label="역할"
						placeholder="역할을 선택해주세요"
						selectedKeys={formData.role ? new Set([formData.role]) : new Set()}
						onSelectionChange={handleRoleChange}
						isInvalid={!!errors.role}
						errorMessage={errors.role}
						isRequired
					>
						{ROLE_OPTIONS.map((option) => (
							<SelectItem key={option.value}>{option.label}</SelectItem>
						))}
					</Select>

					{/* 비밀번호 변경 안내 */}
					<div className="rounded-lg bg-default-100 p-4">
						<Text className="text-sm text-default-600">
							비밀번호 변경은 회원 상세 페이지에서 별도로 진행해주세요.
						</Text>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button
						variant="light"
						onPress={handleClose}
						isDisabled={isSubmitting}
					>
						<Text>취소</Text>
					</Button>
					<Button
						color="primary"
						onPress={handleSubmit}
						isLoading={isSubmitting}
					>
						<Text>저장</Text>
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

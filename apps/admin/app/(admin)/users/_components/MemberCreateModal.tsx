"use client";

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
import { Eye, EyeOff, Mail, Phone, User } from "lucide-react";
import { useState } from "react";

// 역할 옵션
const ROLE_OPTIONS = [
	{ value: "USER", label: "회원" },
	{ value: "ADMIN", label: "관리자" },
];

// 폼 데이터 타입
interface MemberFormData {
	name: string;
	email: string;
	phone: string;
	password: string;
	passwordConfirm: string;
	role: string;
}

// 폼 에러 타입
interface FormErrors {
	name?: string;
	email?: string;
	phone?: string;
	password?: string;
	passwordConfirm?: string;
	role?: string;
}

interface MemberCreateModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: MemberFormData) => Promise<void>;
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

// 비밀번호 유효성 검사 (8자 이상, 영문+숫자+특수문자)
const isValidPassword = (password: string): boolean => {
	const hasLetter = /[a-zA-Z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
	return password.length >= 8 && hasLetter && hasNumber && hasSpecial;
};

/**
 * 회원 등록 모달
 */
export function MemberCreateModal({
	isOpen,
	onClose,
	onSubmit,
}: MemberCreateModalProps) {
	const [formData, setFormData] = useState<MemberFormData>({
		name: "",
		email: "",
		phone: "",
		password: "",
		passwordConfirm: "",
		role: "USER",
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

	// 입력값 변경 핸들러
	const handleChange = (field: keyof MemberFormData, value: string) => {
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

		// 비밀번호 검사
		if (!formData.password) {
			newErrors.password = "비밀번호를 입력해주세요.";
		} else if (!isValidPassword(formData.password)) {
			newErrors.password =
				"비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.";
		}

		// 비밀번호 확인 검사
		if (!formData.passwordConfirm) {
			newErrors.passwordConfirm = "비밀번호 확인을 입력해주세요.";
		} else if (formData.password !== formData.passwordConfirm) {
			newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
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
		if (!validateForm()) return;

		setIsSubmitting(true);
		try {
			await onSubmit(formData);
			handleClose();
		} catch {
			// 에러는 부모 컴포넌트에서 처리
		} finally {
			setIsSubmitting(false);
		}
	};

	// 모달 닫기 핸들러
	const handleClose = () => {
		setFormData({
			name: "",
			email: "",
			phone: "",
			password: "",
			passwordConfirm: "",
			role: "USER",
		});
		setErrors({});
		setShowPassword(false);
		setShowPasswordConfirm(false);
		onClose();
	};

	// 비밀번호 표시 토글
	const handleTogglePassword = () => {
		setShowPassword((prev) => !prev);
	};

	const handleTogglePasswordConfirm = () => {
		setShowPasswordConfirm((prev) => !prev);
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
					<span className="text-xl font-semibold">회원 등록</span>
					<span className="text-sm text-default-500">
						새로운 회원 정보를 입력해주세요.
					</span>
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

					{/* 비밀번호 */}
					<Input
						type={showPassword ? "text" : "password"}
						label="비밀번호"
						placeholder="8자 이상, 영문/숫자/특수문자 포함"
						value={formData.password}
						onValueChange={(value) => handleChange("password", value)}
						isInvalid={!!errors.password}
						errorMessage={errors.password}
						isRequired
						endContent={
							<button
								type="button"
								onClick={handleTogglePassword}
								className="text-default-400 hover:text-default-600"
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						}
					/>

					{/* 비밀번호 확인 */}
					<Input
						type={showPasswordConfirm ? "text" : "password"}
						label="비밀번호 확인"
						placeholder="비밀번호를 다시 입력해주세요"
						value={formData.passwordConfirm}
						onValueChange={(value) => handleChange("passwordConfirm", value)}
						isInvalid={!!errors.passwordConfirm}
						errorMessage={errors.passwordConfirm}
						isRequired
						endContent={
							<button
								type="button"
								onClick={handleTogglePasswordConfirm}
								className="text-default-400 hover:text-default-600"
							>
								{showPasswordConfirm ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						}
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
				</ModalBody>
				<ModalFooter>
					<Button
						variant="light"
						onPress={handleClose}
						isDisabled={isSubmitting}
					>
						<span>취소</span>
					</Button>
					<Button
						color="primary"
						onPress={handleSubmit}
						isLoading={isSubmitting}
					>
						<span>등록</span>
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

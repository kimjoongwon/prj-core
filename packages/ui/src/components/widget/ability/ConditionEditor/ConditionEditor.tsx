"use client";

import { Chip, cn, Tooltip } from "@heroui/react";
import { AlertCircle, Info } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Textarea } from "../../../inputs/Textarea";
import { HStack } from "../../../ui/surfaces/HStack/HStack";
import { VStack } from "../../../ui/surfaces/VStack/VStack";

/**
 * 허용된 템플릿 변수 목록
 */
const TEMPLATE_VARIABLES = [
	{ key: "${user.id}", label: "사용자 ID" },
	{ key: "${user.spaceId}", label: "스페이스 ID" },
	{ key: "${user.email}", label: "이메일" },
	{ key: "${user.name}", label: "이름" },
	{ key: "${user.mainTenantId}", label: "메인 테넌트 ID" },
	{ key: "${user.mainSpaceId}", label: "메인 스페이스 ID" },
	{ key: "${user.mainRoleId}", label: "메인 역할 ID" },
] as const;

export interface ConditionEditorProps {
	/** 현재 조건 값 (JSON 객체 또는 null) */
	value: Record<string, unknown> | null;
	/** 조건 값 변경 핸들러 */
	onChange: (conditions: Record<string, unknown> | null) => void;
	/** 선택 가능한 필드 목록 (자동완성용) */
	subjectFields?: string[];
	/** 외부에서 전달된 에러 메시지 */
	error?: string;
	/** 비활성화 여부 */
	isDisabled?: boolean;
	/** 라벨 */
	label?: string;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * ConditionEditor Widget 컴포넌트
 *
 * CASL Ability의 conditions (JSON 조건)을 편집하는 위젯입니다.
 * 템플릿 변수 지원 및 JSON 유효성 검사 기능을 제공합니다.
 *
 * @example
 * ```tsx
 * <ConditionEditor
 *   value={{ departmentId: "${user.mainTenantId}" }}
 *   onChange={(conditions) => console.log(conditions)}
 *   subjectFields={["id", "departmentId", "name"]}
 * />
 * ```
 */
export const ConditionEditor = observer(
	({
		value,
		onChange,
		subjectFields,
		error,
		isDisabled = false,
		label = "조건 (Conditions)",
		className,
	}: ConditionEditorProps) => {
		// 편집 중인 텍스트 상태 (JSON 문자열)
		const [textValue, setTextValue] = useState(() =>
			value ? JSON.stringify(value, null, 2) : "",
		);
		const [internalError, setInternalError] = useState<string | null>(null);

		// 외부 value가 변경되면 텍스트 동기화
		useEffect(() => {
			const newText = value ? JSON.stringify(value, null, 2) : "";
			setTextValue(newText);
		}, [value]);

		/**
		 * 텍스트 변경 핸들러
		 */
		const handleChange = (text: string) => {
			setTextValue(text);

			// 빈 문자열인 경우 null 반환
			const trimmed = text.trim();
			if (trimmed === "") {
				setInternalError(null);
				onChange(null);
				return;
			}

			// JSON 파싱 시도
			try {
				const parsed = JSON.parse(trimmed);

				// 객체가 아닌 경우 에러
				if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
					setInternalError("조건은 객체 형식이어야 합니다");
					return;
				}

				setInternalError(null);
				onChange(parsed);
			} catch {
				setInternalError("유효한 JSON 형식이 아닙니다");
			}
		};

		/**
		 * 템플릿 변수 삽입 핸들러
		 * 텍스트 끝에 변수를 추가합니다 (값 위치에 삽입하기 쉽도록)
		 */
		const handleInsertVariable = (variable: string) => {
			if (isDisabled) return;

			// 현재 텍스트 끝에 변수 추가
			const newText = textValue + variable;
			handleChange(newText);
		};

		// 표시할 에러 (외부 에러 우선)
		const displayError = error ?? internalError;

		return (
			<VStack gap={2} className={cn("w-full", className)}>
				{/* 라벨 */}
				<HStack alignItems="center" gap={4}>
					<span className="text-sm font-medium text-foreground">{label}</span>
					{subjectFields && subjectFields.length > 0 && (
						<Tooltip
							content={
								<VStack gap={1} className="p-2">
									<span className="text-xs font-medium">사용 가능한 필드:</span>
									<span className="text-xs text-default-500">
										{subjectFields.join(", ")}
									</span>
								</VStack>
							}
						>
							<Info className="h-4 w-4 cursor-help text-default-400" />
						</Tooltip>
					)}
				</HStack>

				{/* JSON 에디터 (Textarea) */}
				<Textarea
					value={textValue}
					onChange={handleChange}
					placeholder={`{\n  "departmentId": "hr-department-id"\n}`}
					minRows={4}
					maxRows={12}
					isDisabled={isDisabled}
					isInvalid={!!displayError}
					classNames={{
						input: "font-mono text-sm",
						inputWrapper: cn(
							"bg-content2 border border-divider",
							displayError && "border-danger",
						),
					}}
				/>

				{/* 에러 메시지 */}
				{displayError && (
					<HStack alignItems="center" gap={4}>
						<AlertCircle className="h-4 w-4 text-danger" />
						<span className="text-xs text-danger">{displayError}</span>
					</HStack>
				)}

				{/* 템플릿 변수 버튼 */}
				<VStack gap={1}>
					<HStack alignItems="center" gap={4}>
						<Info className="h-3 w-3 text-default-400" />
						<span className="text-xs text-default-500">템플릿 변수:</span>
					</HStack>
					<HStack gap={4} className="flex-wrap">
						{TEMPLATE_VARIABLES.map((variable) => (
							<Tooltip key={variable.key} content={variable.label}>
								<Chip
									size="sm"
									variant="flat"
									className="cursor-pointer hover:bg-default-200"
									isDisabled={isDisabled}
									onClick={() => handleInsertVariable(variable.key)}
								>
									{variable.key}
								</Chip>
							</Tooltip>
						))}
					</HStack>
				</VStack>
			</VStack>
		);
	},
);

ConditionEditor.displayName = "ConditionEditor";

"use client";

import { cn, Tooltip } from "@heroui/react";
import { AlertCircle, Info } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Chip } from "../../data-display/Chip/Chip";
import { TextArea } from "../../input/TextArea/TextArea";

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
				if (
					typeof parsed !== "object" ||
					parsed === null ||
					Array.isArray(parsed)
				) {
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
			<div className={cn("w-full", className)}>
				{/* 라벨 */}
				<div className="flex">
					<span className="flex flex-col gap-2 items-center text-sm font-medium text-foreground">
						{label}
					</span>
					{subjectFields && subjectFields.length > 0 && (
						<Tooltip>
							<Tooltip.Trigger>
								<Info className="h-4 w-4 cursor-help text-muted" />
							</Tooltip.Trigger>
							<Tooltip.Content>
								<div className="flex flex-col p-2">
									<span className="text-xs font-medium">사용 가능한 필드:</span>
									<span className="text-xs text-muted">
										{subjectFields.join(", ")}
									</span>
								</div>
							</Tooltip.Content>
						</Tooltip>
					)}
				</div>

				{/* JSON 에디터 (TextArea) */}
				<TextArea
					value={textValue}
					onChange={handleChange}
					placeholder={`{\n  "departmentId": "hr-department-id"\n}`}
					minRows={4}
					maxRows={12}
					isDisabled={isDisabled}
					isInvalid={!!displayError}
					classNames={{
						input: "font-mono text-sm",
						inputWrapper:
							cn(
								"bg-surface-secondary border border-border",
								displayError && "border-danger",
							) ?? "",
					}}
				/>

				{/* 에러 메시지 */}
				{displayError && (
					<div className="flex">
						<AlertCircle className="h-4 w-4 text-danger" />
						<span className="text-xs text-danger">{displayError}</span>
					</div>
				)}

				{/* 템플릿 변수 버튼 */}
				<div className="flex flex-col gap-1">
					<div>
						<Info className="flex gap-4 items-center h-3 w-3 text-muted" />
						<span className="text-xs text-muted">템플릿 변수:</span>
					</div>
					<div className="flex gap-4 flex-wrap">
						{TEMPLATE_VARIABLES.map((variable) => (
							<Tooltip key={variable.key}>
								<Tooltip.Trigger>
									<Chip
										size="sm"
										variant="flat"
										className="cursor-pointer hover:bg-default"
										isDisabled={isDisabled}
										onClick={() => handleInsertVariable(variable.key)}
									>
										{variable.key}
									</Chip>
								</Tooltip.Trigger>
								<Tooltip.Content>{variable.label}</Tooltip.Content>
							</Tooltip>
						))}
					</div>
				</div>
			</div>
		);
	},
);

ConditionEditor.displayName = "ConditionEditor";

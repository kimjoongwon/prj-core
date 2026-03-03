"use client";

import type {
	ActionConfig,
	ActionFormatConfig,
	ActionMaskingConfig,
	ActionTransformConfig,
} from "@cocrepo/entity";
import { Card, CardBody, cn } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { Input } from "../../../inputs/Input/Input";
import { Select } from "../../../inputs/Select/Select";
import { HStack } from "../../../layouts/HStack/HStack";
import { VStack } from "../../../layouts/VStack/VStack";

/**
 * 마스킹 프리셋 옵션
 */
const MASKING_PRESET_OPTIONS = [
	{ value: "", text: "커스텀 패턴 사용" },
	{ value: "PRESET_EMAIL", text: "이메일 마스킹" },
	{ value: "PRESET_PHONE", text: "전화번호 마스킹" },
	{ value: "PRESET_NAME", text: "이름 마스킹" },
	{ value: "PRESET_SSN", text: "주민등록번호 마스킹" },
	{ value: "PRESET_CARD", text: "카드번호 마스킹" },
	{ value: "PRESET_ACCOUNT", text: "계좌번호 마스킹" },
];

/**
 * 변환 규칙 옵션
 */
const TRANSFORM_RULE_OPTIONS = [
	{ value: "uppercase", text: "대문자로 변환" },
	{ value: "lowercase", text: "소문자로 변환" },
	{ value: "capitalize", text: "첫 글자 대문자" },
	{ value: "trim", text: "공백 제거" },
];

/**
 * 포맷 패턴 예시 옵션
 */
const FORMAT_PATTERN_EXAMPLES = [
	{ value: "YYYY-MM-DD", text: "날짜 (YYYY-MM-DD)" },
	{ value: "YYYY-MM-DD HH:mm:ss", text: "날짜시간 (YYYY-MM-DD HH:mm:ss)" },
	{ value: "###-####-####", text: "전화번호 (###-####-####)" },
	{ value: "#,###", text: "숫자 (#,###)" },
];

export interface ActionConfigEditorProps {
	/** 설정 타입 */
	configType: "masking" | "format" | "transform" | null;
	/** 현재 설정 값 */
	config: ActionConfig | null;
	/** 설정 변경 핸들러 */
	onChange: (config: ActionConfig | null) => void;
	/** 미리보기용 샘플 값 */
	previewValue?: string;
}

/**
 * ActionConfigEditor Widget 컴포넌트
 *
 * Action의 config (마스킹, 포맷팅, 변환 설정)을 편집하는 위젯입니다.
 * configType에 따라 다른 UI를 표시합니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <ActionConfigEditor
 *   configType="masking"
 *   config={{ type: 'masking', preset: 'PRESET_EMAIL' }}
 *   onChange={handleConfigChange}
 *   previewValue="test@example.com"
 * />
 * ```
 */
export const ActionConfigEditor = observer(
	({ configType, config, onChange, previewValue }: ActionConfigEditorProps) => {
		/**
		 * 마스킹 설정 변경 핸들러
		 */
		const handleMaskingChange = (
			field: keyof ActionMaskingConfig,
			value: string,
		) => {
			const currentConfig = (config as ActionMaskingConfig) || {
				type: "masking" as const,
			};

			if (field === "preset") {
				// 프리셋 선택 시 커스텀 패턴 초기화
				onChange({
					type: "masking",
					preset: value || undefined,
					pattern: value ? undefined : currentConfig.pattern,
					replacement: value ? undefined : currentConfig.replacement,
				});
			} else {
				onChange({
					...currentConfig,
					type: "masking",
					[field]: value || undefined,
				});
			}
		};

		/**
		 * 포맷 설정 변경 핸들러
		 */
		const handleFormatChange = (pattern: string) => {
			onChange({
				type: "format",
				pattern,
			});
		};

		/**
		 * 변환 설정 변경 핸들러
		 */
		const handleTransformChange = (rule: string) => {
			onChange({
				type: "transform",
				rule,
			});
		};

		/**
		 * 마스킹 미리보기 결과 계산
		 */
		const getMaskingPreview = (): string | null => {
			if (!previewValue || configType !== "masking") return null;

			const maskingConfig = config as ActionMaskingConfig | null;
			if (!maskingConfig) return previewValue;

			// 프리셋에 따른 마스킹 미리보기
			if (maskingConfig.preset) {
				switch (maskingConfig.preset) {
					case "PRESET_EMAIL": {
						const [local, domain] = previewValue.split("@");
						if (local && domain) {
							const maskedLocal =
								local.length > 2
									? `${local[0]}${"*".repeat(local.length - 2)}${local[local.length - 1]}`
									: "*".repeat(local.length);
							return `${maskedLocal}@${domain}`;
						}
						return previewValue;
					}
					case "PRESET_PHONE":
						return previewValue.replace(/(\d{3})(\d{4})(\d{4})/, "$1-****-$3");
					case "PRESET_NAME":
						if (previewValue.length > 1) {
							return `${previewValue[0]}${"*".repeat(previewValue.length - 1)}`;
						}
						return "*";
					case "PRESET_SSN":
						return previewValue.replace(/(\d{6})[-]?(\d{7})/, "$1-*******");
					case "PRESET_CARD":
						return previewValue.replace(
							/(\d{4})(\d{4})(\d{4})(\d{4})/,
							"$1-****-****-$4",
						);
					case "PRESET_ACCOUNT":
						if (previewValue.length > 4) {
							return `${"*".repeat(previewValue.length - 4)}${previewValue.slice(-4)}`;
						}
						return previewValue;
					default:
						return previewValue;
				}
			}

			// 커스텀 패턴 마스킹
			if (maskingConfig.pattern) {
				try {
					const regex = new RegExp(maskingConfig.pattern, "g");
					return previewValue.replace(regex, maskingConfig.replacement || "*");
				} catch {
					return previewValue;
				}
			}

			return previewValue;
		};

		// configType이 null인 경우
		if (configType === null) {
			return (
				<Card className="bg-content2">
					<CardBody>
						<p className="text-center text-default-500">설정 없음</p>
					</CardBody>
				</Card>
			);
		}

		// 마스킹 설정 UI
		if (configType === "masking") {
			const maskingConfig = config as ActionMaskingConfig | null;
			const preview = getMaskingPreview();

			return (
				<Card className="bg-content2">
					<CardBody>
						<VStack gap={4}>
							{/* 프리셋 선택 */}
							<Select
								label="마스킹 프리셋"
								placeholder="프리셋을 선택하세요"
								options={MASKING_PRESET_OPTIONS}
								value={maskingConfig?.preset || ""}
								onChange={(value) => handleMaskingChange("preset", value)}
							/>

							{/* 커스텀 패턴 입력 (프리셋이 없을 때만) */}
							{!maskingConfig?.preset && (
								<>
									<Input
										label="패턴 (정규식)"
										placeholder="예: \\d{4}"
										value={maskingConfig?.pattern || ""}
										onChange={(value) =>
											handleMaskingChange("pattern", String(value))
										}
									/>
									<Input
										label="대체 문자"
										placeholder="예: ****"
										value={maskingConfig?.replacement || ""}
										onChange={(value) =>
											handleMaskingChange("replacement", String(value))
										}
									/>
								</>
							)}

							{/* 미리보기 */}
							{previewValue && (
								<VStack gap={2}>
									<p className="text-sm font-medium text-default-600">
										미리보기
									</p>
									<HStack
										gap={8}
										alignItems="center"
										className={cn("rounded-lg bg-content3 px-4 py-3")}
									>
										<VStack gap={1}>
											<span className="text-xs text-default-400">원본</span>
											<span className="font-mono text-sm text-default-700">
												{previewValue}
											</span>
										</VStack>
										<span className="text-default-400">→</span>
										<VStack gap={1}>
											<span className="text-xs text-default-400">
												마스킹 결과
											</span>
											<span className="font-mono text-sm text-primary">
												{preview}
											</span>
										</VStack>
									</HStack>
								</VStack>
							)}
						</VStack>
					</CardBody>
				</Card>
			);
		}

		// 포맷 설정 UI
		if (configType === "format") {
			const formatConfig = config as ActionFormatConfig | null;

			return (
				<Card className="bg-content2">
					<CardBody>
						<VStack gap={4}>
							{/* 포맷 패턴 선택 */}
							<Select
								label="포맷 패턴 예시"
								placeholder="예시를 선택하거나 직접 입력"
								options={FORMAT_PATTERN_EXAMPLES}
								value={formatConfig?.pattern || ""}
								onChange={(value) => handleFormatChange(value)}
							/>

							{/* 커스텀 패턴 입력 */}
							<Input
								label="포맷 패턴"
								placeholder="예: YYYY-MM-DD"
								value={formatConfig?.pattern || ""}
								onChange={(value) => handleFormatChange(String(value))}
								description="Y: 연도, M: 월, D: 일, H: 시, m: 분, s: 초, #: 숫자"
							/>

							{/* 미리보기 */}
							{previewValue && formatConfig?.pattern && (
								<VStack gap={2}>
									<p className="text-sm font-medium text-default-600">
										미리보기
									</p>
									<div className={cn("rounded-lg bg-content3 px-4 py-3")}>
										<HStack gap={8} alignItems="center">
											<VStack gap={1}>
												<span className="text-xs text-default-400">원본</span>
												<span className="font-mono text-sm text-default-700">
													{previewValue}
												</span>
											</VStack>
											<span className="text-default-400">→</span>
											<VStack gap={1}>
												<span className="text-xs text-default-400">패턴</span>
												<span className="font-mono text-sm text-primary">
													{formatConfig.pattern}
												</span>
											</VStack>
										</HStack>
									</div>
								</VStack>
							)}
						</VStack>
					</CardBody>
				</Card>
			);
		}

		// 변환 설정 UI
		if (configType === "transform") {
			const transformConfig = config as ActionTransformConfig | null;

			/**
			 * 변환 미리보기 결과
			 */
			const getTransformPreview = (): string | null => {
				if (!previewValue || !transformConfig?.rule) return null;

				switch (transformConfig.rule) {
					case "uppercase":
						return previewValue.toUpperCase();
					case "lowercase":
						return previewValue.toLowerCase();
					case "capitalize":
						return (
							previewValue.charAt(0).toUpperCase() +
							previewValue.slice(1).toLowerCase()
						);
					case "trim":
						return previewValue.trim();
					default:
						return previewValue;
				}
			};

			const preview = getTransformPreview();

			return (
				<Card className="bg-content2">
					<CardBody>
						<VStack gap={4}>
							{/* 변환 규칙 선택 */}
							<Select
								label="변환 규칙"
								placeholder="변환 규칙을 선택하세요"
								options={TRANSFORM_RULE_OPTIONS}
								value={transformConfig?.rule || ""}
								onChange={(value) => handleTransformChange(value)}
							/>

							{/* 미리보기 */}
							{previewValue && preview && (
								<VStack gap={2}>
									<p className="text-sm font-medium text-default-600">
										미리보기
									</p>
									<div className={cn("rounded-lg bg-content3 px-4 py-3")}>
										<HStack gap={8} alignItems="center">
											<VStack gap={1}>
												<span className="text-xs text-default-400">원본</span>
												<span className="font-mono text-sm text-default-700">
													{previewValue}
												</span>
											</VStack>
											<span className="text-default-400">→</span>
											<VStack gap={1}>
												<span className="text-xs text-default-400">
													변환 결과
												</span>
												<span className="font-mono text-sm text-primary">
													{preview}
												</span>
											</VStack>
										</HStack>
									</div>
								</VStack>
							)}
						</VStack>
					</CardBody>
				</Card>
			);
		}

		return null;
	},
);

ActionConfigEditor.displayName = "ActionConfigEditor";

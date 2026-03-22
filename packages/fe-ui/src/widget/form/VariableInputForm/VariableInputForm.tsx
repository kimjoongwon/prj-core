"use client";

import { observer } from "mobx-react-lite";
import { Input } from "../../../input/Input/Input";
import type { TemplateVariable } from "../../VariableReadTable/VariableReadTable";

export interface VariableInputFormProps {
	/** 변수 목록 (정의 정보) */
	variables: TemplateVariable[];
	/** 현재 입력된 값 */
	values: Record<string, string>;
	/** 값 변경 핸들러 */
	onChange: (values: Record<string, string>) => void;
}

/**
 * VariableInputForm 컴포넌트
 * 미리보기/발송테스트 모달에서 공통으로 사용하는 변수 입력 폼입니다.
 * 템플릿 변수 목록을 받아 각 변수에 대한 Input을 렌더링합니다.
 *
 * @example
 * ```tsx
 * <VariableInputForm
 *   variables={[
 *     { id: "1", name: "userName", description: "사용자 이름", defaultValue: null, isRequired: true },
 *     { id: "2", name: "appName", description: "앱 이름", defaultValue: "서비스", isRequired: false },
 *   ]}
 *   values={{ userName: "홍길동", appName: "" }}
 *   onChange={(newValues) => setValues(newValues)}
 * />
 * ```
 */
export const VariableInputForm = observer(
	({ variables, values, onChange }: VariableInputFormProps) => {
		if (variables.length === 0) {
			return (
				<p className="text-sm text-default-400">정의된 변수가 없습니다.</p>
			);
		}

		const handleValueChange = (
			variableName: string,
			value: string | number,
		) => {
			onChange({
				...values,
				[variableName]: String(value),
			});
		};

		return (
			<div className="flex flex-col gap-3">
				{variables.map((variable) => {
					const label = variable.description ?? variable.name;
					const displayLabel = variable.isRequired ? `${label} *` : label;

					const placeholder = variable.defaultValue
						? `(기본값: ${variable.defaultValue})`
						: undefined;

					return (
						<Input
							key={variable.id}
							label={displayLabel}
							placeholder={placeholder}
							value={values[variable.name] ?? ""}
							onChange={(value) => handleValueChange(variable.name, value)}
							isRequired={variable.isRequired}
							size="sm"
						/>
					);
				})}
			</div>
		);
	},
);

VariableInputForm.displayName = "VariableInputForm";

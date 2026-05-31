"use client";

import type { Option } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import type { SelectProps } from "../../design-system/primitives";
import { Select, SelectItem } from "../../design-system/primitives";
import { useT } from "../../i18n";

export interface Assignee {
	/** 사용자 ID */
	id: string;
	/** 사용자명 */
	name: string;
	/** 이메일 */
	email?: string;
	/** 프로필 이미지 URL */
	avatarUrl?: string;
	/** 역할 */
	role?: string;
}

export interface AssigneeSelectProps
	extends Omit<SelectProps, "children" | "selectedKeys" | "onChange"> {
	/** 담당자 목록 */
	assignees?: Assignee[];
	/** 선택된 담당자 ID */
	value?: string;
	/** 값 변경 핸들러 */
	onChange?: (value: string) => void;
	/** 미배정 옵션 포함 여부 */
	includeUnassigned?: boolean;
}

/**
 * 담당자 선택 컴포넌트
 * 문의의 담당자를 선택하는 드롭다운입니다.
 *
 * @example
 * ```tsx
 * const assignees = [
 *   { id: "1", name: "김상담", email: "agent1@example.com", role: "상담원" },
 *   { id: "2", name: "이매니저", email: "agent2@example.com", role: "매니저" },
 * ];
 *
 * <AssigneeSelect
 *   label="담당자"
 *   assignees={assignees}
 *   value={assigneeId}
 *   onChange={setAssigneeId}
 *   includeUnassigned
 * />
 * ```
 */
export const AssigneeSelect = observer(function AssigneeSelect(
	props: AssigneeSelectProps,
) {
	const t = useT();
	const {
		assignees = [],
		value,
		onChange,
		includeUnassigned = true,
		label = "담당자",
		placeholder = "담당자를 선택하세요",
		...rest
	} = props;

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onChange?.(e.target.value);
	};

	// 미배정 옵션 추가
	const options: Option[] = includeUnassigned
		? [
				{ value: "", text: "미배정" },
				...assignees.map((a) => ({ value: a.id, text: a.name })),
			]
		: assignees.map((a) => ({ value: a.id, text: a.name }));

	return (
		<Select
			{...rest}
			label={typeof label === "string" ? t(label) : label}
			placeholder={
				typeof placeholder === "string" ? t(placeholder) : placeholder
			}
			variant="bordered"
			selectedKeys={value ? [value] : value === "" ? [""] : undefined}
			onChange={handleChange}
		>
			{options.map((option) => {
				const assignee = assignees.find((a) => a.id === option.value);
				return (
					<SelectItem
						key={option.value || "unassigned"}
						textValue={option.text}
					>
						{option.value === "" ? (
							<span className="text-default-400">{t(option.text)}</span>
						) : (
							<div className="flex items-center gap-2">
								{assignee?.avatarUrl && (
									<img
										src={assignee.avatarUrl}
										alt={assignee.name}
										className="w-6 h-6 rounded-full"
									/>
								)}
								<div className="flex flex-col">
									<span>{option.text}</span>
									{assignee?.role && (
										<span className="text-small text-default-400">
											{t(assignee.role)}
										</span>
									)}
								</div>
							</div>
						)}
					</SelectItem>
				);
			})}
		</Select>
	);
});

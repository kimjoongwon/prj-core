"use client";

import { Button, Input } from "@cocrepo/ui/heroui";
import { Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";

export interface RedirectUriListInputProps {
	/** URI 목록 */
	value: string[];
	/** 변경 핸들러 */
	onChange: (uris: string[]) => void;
	/** URI별 에러 메시지 */
	errors?: Record<number, string>;
	/** 읽기 전용 */
	isReadOnly?: boolean;
}

/**
 * Redirect URI 동적 추가/삭제 입력 위젯
 */
export const RedirectUriListInput = observer(
	({
		value,
		onChange,
		errors,
		isReadOnly = false,
	}: RedirectUriListInputProps) => {
		const handleAdd = () => {
			onChange([...value, ""]);
		};

		const handleRemove = (index: number) => {
			onChange(value.filter((_, i) => i !== index));
		};

		const handleChange = (index: number, newValue: string) => {
			const updated = [...value];
			updated[index] = newValue;
			onChange(updated);
		};

		return (
			<div className="space-y-2">
				{value.map((uri, index) => (
					<div key={index} className="flex items-start gap-2">
						<Input
							size="sm"
							placeholder="https://example.com/callback"
							value={uri}
							onValueChange={(v) => handleChange(index, v)}
							isInvalid={!!errors?.[index]}
							errorMessage={errors?.[index]}
							isReadOnly={isReadOnly}
							className="flex-1"
						/>
						{!isReadOnly && (
							<Button
								isIconOnly
								size="sm"
								variant="light"
								color="danger"
								onPress={() => handleRemove(index)}
								aria-label="URI 삭제"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						)}
					</div>
				))}
				{!isReadOnly && (
					<Button
						size="sm"
						variant="flat"
						startContent={<Plus className="h-4 w-4" />}
						onPress={handleAdd}
					>
						URI 추가
					</Button>
				)}
			</div>
		);
	},
);

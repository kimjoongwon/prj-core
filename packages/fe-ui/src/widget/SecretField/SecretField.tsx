"use client";

import { Button, Snippet } from "@cocrepo/ui/heroui";
import { Eye, EyeOff } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";

export interface SecretFieldProps {
	/** 비밀 값 */
	value: string | null | undefined;
	/** 마스킹 문자 */
	maskChar?: string;
	/** 마스킹 길이 */
	maskLength?: number;
}

/**
 * 비밀 값을 마스킹/표시/복사할 수 있는 위젯
 */
export const SecretField = observer(
	({ value, maskChar = "\u2022", maskLength = 16 }: SecretFieldProps) => {
		const [isVisible, setIsVisible] = useState(false);

		if (!value) {
			return <span className="text-default-400">-</span>;
		}

		const maskedValue = maskChar.repeat(maskLength);

		const handleToggleVisibility = () => {
			setIsVisible((prev) => !prev);
		};

		return (
			<div className="flex items-center gap-2">
				<Snippet
					symbol=""
					size="sm"
					variant="flat"
					codeString={value}
					className="max-w-[300px]"
				>
					<span className="font-mono text-sm">
						{isVisible ? value : maskedValue}
					</span>
				</Snippet>
				<Button
					isIconOnly
					size="sm"
					variant="light"
					onPress={handleToggleVisibility}
					aria-label={isVisible ? "숨기기" : "보기"}
				>
					{isVisible ? (
						<EyeOff className="h-4 w-4" />
					) : (
						<Eye className="h-4 w-4" />
					)}
				</Button>
			</div>
		);
	},
);

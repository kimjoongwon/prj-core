import { cn } from "@heroui/react";
import { DeviceType } from "../../../../registry/types";

/** DeviceToggleGroup Props */
export interface DeviceToggleGroupProps {
	/** 현재 활성화된 디바이스 목록 */
	value: DeviceType[];
	/** 변경 핸들러 */
	onChange: (devices: DeviceType[]) => void;
	/** 비활성화 여부 */
	disabled?: boolean;
	/** 크기 */
	size?: "sm" | "md";
}

/** 디바이스 설정 */
const DEVICE_CONFIG = [
	{ key: DeviceType.DESKTOP, label: "D" },
	{ key: DeviceType.TABLET, label: "T" },
	{ key: DeviceType.MOBILE, label: "M" },
];

/**
 * 디바이스 타입 토글 그룹
 * - Desktop(D), Tablet(T), Mobile(M) 세 가지 디바이스 타입 토글
 * - 각 디바이스별 독립적 on/off 상태
 */
export function DeviceToggleGroup({
	value,
	onChange,
	disabled = false,
	size = "sm",
}: DeviceToggleGroupProps) {
	const handleToggle = (device: DeviceType) => {
		if (disabled) return;
		const newValue = value.includes(device)
			? value.filter((d) => d !== device)
			: [...value, device];
		onChange(newValue);
	};

	const sizeClasses = size === "sm" ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm";

	return (
		<div className="flex gap-0.5">
			{DEVICE_CONFIG.map(({ key, label }) => {
				const isActive = value.includes(key);
				return (
					<button
						key={key}
						type="button"
						onClick={() => handleToggle(key)}
						disabled={disabled}
						className={cn(
							sizeClasses,
							"rounded font-medium transition-colors",
							isActive
								? "bg-primary text-primary-foreground"
								: "bg-default-100 text-default-500 hover:bg-default-200",
							disabled && "opacity-50 cursor-not-allowed",
						)}
						aria-label={`${key} ${isActive ? "활성화됨" : "비활성화됨"}`}
					>
						{label}
					</button>
				);
			})}
		</div>
	);
}

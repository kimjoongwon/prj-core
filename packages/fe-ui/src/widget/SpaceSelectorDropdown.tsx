"use client";

import { Dropdown } from "@heroui/react";
import { Building2, Check, ChevronDown } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../action/Button/Button";

/**
 * Space 정보 인터페이스
 */
export interface SpaceInfo {
	tenantId: string;
	spaceId: string;
	groundName: string;
}

export interface SpaceSelectorDropdownProps {
	/** 선택 가능한 Space 목록 */
	spaces: SpaceInfo[];
	/** 현재 선택된 Tenant ID */
	currentTenantId: string | null;
	/** 현재 선택된 Space 이름 */
	currentSpaceName: string | null;
	/** Space 선택 핸들러 */
	onSpaceSelect: (space: SpaceInfo) => void;
}

/**
 * SpaceSelectorDropdown - Space 선택 드롭다운 Widget
 *
 * 헤더에서 사용자가 Space를 전환할 수 있는 드롭다운 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <SpaceSelectorDropdown
 *   spaces={[
 *     { tenantId: "t1", spaceId: "1", groundName: "Space A" },
 *     { tenantId: "t2", spaceId: "2", groundName: "Space B" },
 *   ]}
 *   currentTenantId="t1"
 *   currentSpaceName="Space A"
 *   onSpaceSelect={(space) => console.log("Selected:", space)}
 * />
 * ```
 */
export const SpaceSelectorDropdown = observer(function SpaceSelectorDropdown({
	spaces,
	currentTenantId,
	currentSpaceName,
	onSpaceSelect,
}: SpaceSelectorDropdownProps) {
	const buttonLabel = currentSpaceName ?? "Space 확인 중";
	const buttonClasses =
		"h-11 gap-2 rounded-2xl border border-border bg-surface/80 px-3 text-foreground shadow-sm backdrop-blur-md hover:bg-surface-secondary";

	if (spaces.length === 0) {
		return (
			<Button
				variant="light"
				isDisabled
				className={buttonClasses}
				startContent={<Building2 className="h-4 w-4 text-muted" size={16} />}
			>
				<span className="max-w-32 truncate text-sm text-muted">
					{buttonLabel}
				</span>
			</Button>
		);
	}

	return (
		<Dropdown>
			<Dropdown.Trigger className={buttonClasses}>
				<Building2 className="h-4 w-4 text-muted" size={16} />
				<span className="max-w-32 truncate text-sm text-foreground">
					{buttonLabel}
				</span>
				<ChevronDown className="h-4 w-4 text-muted" size={16} />
			</Dropdown.Trigger>
			<Dropdown.Popover placement="bottom end">
				<Dropdown.Menu
					aria-label="Space 선택"
					onAction={(key) => {
						const selectedSpace = spaces.find((s) => s.tenantId === key);
						if (selectedSpace && selectedSpace.tenantId !== currentTenantId) {
							onSpaceSelect(selectedSpace);
						}
					}}
				>
					{spaces.map((space) => (
						<Dropdown.Item
							id={space.tenantId}
							key={space.tenantId}
							className={
								space.tenantId === currentTenantId ? "text-accent" : undefined
							}
						>
							<span className="flex items-center gap-2">
								{space.tenantId === currentTenantId ? (
									<Check className="w-4 h-4 text-accent" size={16} />
								) : (
									<Building2 className="w-4 h-4 text-muted" size={16} />
								)}
								{space.groundName}
							</span>
						</Dropdown.Item>
					))}
				</Dropdown.Menu>
			</Dropdown.Popover>
		</Dropdown>
	);
});

SpaceSelectorDropdown.displayName = "SpaceSelectorDropdown";

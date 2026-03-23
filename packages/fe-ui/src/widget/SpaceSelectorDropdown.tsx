"use client";

import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/react";
import { Building2, Check, ChevronDown } from "lucide-react";
import { observer } from "mobx-react-lite";

/**
 * Space 정보 인터페이스
 */
export interface SpaceInfo {
	spaceId: string;
	groundName: string;
}

export interface SpaceSelectorDropdownProps {
	/** 선택 가능한 Space 목록 */
	spaces: SpaceInfo[];
	/** 현재 선택된 Space ID */
	currentSpaceId: string | null;
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
 *     { spaceId: "1", groundName: "Space A" },
 *     { spaceId: "2", groundName: "Space B" },
 *   ]}
 *   currentSpaceId="1"
 *   currentSpaceName="Space A"
 *   onSpaceSelect={(space) => console.log("Selected:", space)}
 * />
 * ```
 */
export const SpaceSelectorDropdown = observer(function SpaceSelectorDropdown({
	spaces,
	currentSpaceId,
	currentSpaceName,
	onSpaceSelect,
}: SpaceSelectorDropdownProps) {
	if (spaces.length === 0) {
		return null;
	}

	return (
		<Dropdown placement="bottom-end">
			<DropdownTrigger>
				<Button
					variant="light"
					className="h-11 gap-2 rounded-2xl border border-slate-200/70 bg-white/72 px-3 shadow-sm backdrop-blur-md hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
					startContent={
						<Building2
							className="h-4 w-4 text-slate-500 dark:text-slate-300"
							size={16}
						/>
					}
					endContent={
						<ChevronDown
							className="h-4 w-4 text-slate-400 dark:text-slate-500"
							size={16}
						/>
					}
				>
					<span className="max-w-32 truncate text-sm text-slate-700 dark:text-slate-100">
						{currentSpaceName ?? "Space 선택"}
					</span>
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				aria-label="Space 선택"
				selectionMode="single"
				selectedKeys={currentSpaceId ? new Set([currentSpaceId]) : new Set()}
				onSelectionChange={(keys) => {
					const selectedKey = Array.from(keys)[0] as string;
					const selectedSpace = spaces.find((s) => s.spaceId === selectedKey);
					if (selectedSpace && selectedSpace.spaceId !== currentSpaceId) {
						onSpaceSelect(selectedSpace);
					}
				}}
			>
				{spaces.map((space) => (
					<DropdownItem
						key={space.spaceId}
						startContent={
							space.spaceId === currentSpaceId ? (
								<Check className="w-4 h-4 text-primary" size={16} />
							) : (
								<Building2 className="w-4 h-4 text-default-400" size={16} />
							)
						}
						className={
							space.spaceId === currentSpaceId ? "text-primary" : undefined
						}
					>
						{space.groundName}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
});

SpaceSelectorDropdown.displayName = "SpaceSelectorDropdown";

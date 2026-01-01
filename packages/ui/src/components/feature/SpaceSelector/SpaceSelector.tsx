"use client";

import { usePersistStore } from "@cocrepo/store";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { renderLucideIcon } from "../../../utils/iconUtils";

export interface SpaceSelectorProps {
	/** Space 변경 시 콜백 (API 호출 등) */
	onChangeSpace?: (spaceId: string, groundName: string) => void;
}

/**
 * SpaceSelector Feature 컴포넌트
 * Header의 right 영역에 사용
 * 현재 선택된 Space를 표시하고 드롭다운에서 바로 변경할 수 있습니다.
 *
 * @example
 * ```tsx
 * <Header right={<><SpaceSelector /><UserMenu /></>} />
 * ```
 */
export const SpaceSelector = observer(
	({ onChangeSpace }: SpaceSelectorProps) => {
		const persistStore = usePersistStore();

		// 현재 Space 정보
		const currentSpace =
			persistStore.spaceId && persistStore.groundName
				? { id: persistStore.spaceId, name: persistStore.groundName }
				: null;

		// 선택 가능한 Space 목록
		const spaces = persistStore.spaces || [];

		const handleSelectSpace = (spaceId: string, groundName: string) => {
			// 현재 선택된 Space와 동일하면 무시
			if (spaceId === persistStore.spaceId) return;

			// PersistStore 업데이트 (x-space-id 헤더용)
			persistStore.setSpace(spaceId, groundName);

			// 외부 콜백 호출 (API 호출 등)
			onChangeSpace?.(spaceId, groundName);
		};

		if (!currentSpace) {
			return null;
		}

		// Space가 하나뿐이면 드롭다운 없이 표시
		if (spaces.length <= 1) {
			return (
				<Button variant="bordered" size="sm" isDisabled>
					{currentSpace.name}
				</Button>
			);
		}

		return (
			<Dropdown>
				<DropdownTrigger>
					<Button
						variant="bordered"
						size="sm"
						endContent={renderLucideIcon("ChevronDown", "h-4 w-4", 16)}
					>
						{currentSpace.name}
					</Button>
				</DropdownTrigger>
				<DropdownMenu
					aria-label="Space 선택"
					selectionMode="single"
					selectedKeys={new Set([currentSpace.id])}
				>
					<DropdownSection title="Space 선택">
						{spaces.map((space) => (
							<DropdownItem
								key={space.spaceId}
								startContent={
									space.spaceId === currentSpace.id
										? renderLucideIcon("Check", "h-4 w-4 text-primary", 16)
										: renderLucideIcon("Building2", "h-4 w-4", 16)
								}
								onPress={() =>
									handleSelectSpace(space.spaceId, space.groundName)
								}
							>
								{space.groundName}
							</DropdownItem>
						))}
					</DropdownSection>
				</DropdownMenu>
			</Dropdown>
		);
	},
);

SpaceSelector.displayName = "SpaceSelector";

// 하위 호환성을 위한 타입 export
export interface SpaceSelectorSpace {
	id: string;
	name: string;
}

// 기존 타입 호환성 유지 (deprecated)
/** @deprecated SpaceSelectorSpace를 사용하세요 */
export type ContextSelectorContext = SpaceSelectorSpace;

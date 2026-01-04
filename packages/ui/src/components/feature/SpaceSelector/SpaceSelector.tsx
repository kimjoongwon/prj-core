"use client";

import { usePersistStore } from "@cocrepo/store";
import {
	Avatar,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
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

		// Hydration 완료 체크 (서버/클라이언트 불일치 방지)
		const [isHydrated, setIsHydrated] = useState(false);
		useEffect(() => {
			setIsHydrated(true);
		}, []);

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

		// Hydration 완료 전에는 렌더링하지 않음 (SSR/CSR 불일치 방지)
		if (!isHydrated || !currentSpace) {
			return null;
		}

		// Space가 하나뿐이면 드롭다운 없이 표시
		if (spaces.length <= 1) {
			return (
				<div className="flex items-center gap-2 rounded-lg border border-default-200 bg-default-50 px-3 py-2">
					<Avatar
						icon={renderLucideIcon("Building2", "h-4 w-4", 16)}
						className="h-6 w-6 bg-primary-100 text-primary"
						size="sm"
					/>
					<span className="text-sm font-medium text-default-700">
						{currentSpace.name}
					</span>
				</div>
			);
		}

		return (
			<Dropdown placement="bottom-end">
				<DropdownTrigger>
					<Button
						variant="flat"
						className="h-auto min-h-0 gap-2 bg-default-100 px-3 py-2 hover:bg-default-200"
					>
						<Avatar
							icon={renderLucideIcon("Building2", "h-4 w-4", 16)}
							className="h-6 w-6 bg-primary-100 text-primary"
							size="sm"
						/>
						<span className="text-sm font-medium text-default-700">
							{currentSpace.name}
						</span>
						{renderLucideIcon("ChevronDown", "h-4 w-4 text-default-400", 16)}
					</Button>
				</DropdownTrigger>
				<DropdownMenu
					aria-label="Space 선택"
					variant="flat"
					selectionMode="single"
					selectedKeys={new Set([currentSpace.id])}
					className="min-w-[200px]"
				>
					{spaces.map((space) => (
						<DropdownItem
							key={space.spaceId}
							startContent={
								<Avatar
									icon={renderLucideIcon("Building2", "h-4 w-4", 16)}
									className="h-6 w-6 bg-default-100 text-default-600"
									size="sm"
								/>
							}
							endContent={
								space.spaceId === currentSpace.id
									? renderLucideIcon("Check", "h-4 w-4 text-primary", 16)
									: null
							}
							className={
								space.spaceId === currentSpace.id
									? "bg-primary-50 text-primary"
									: ""
							}
							onPress={() => handleSelectSpace(space.spaceId, space.groundName)}
						>
							<span className="font-medium">{space.groundName}</span>
						</DropdownItem>
					))}
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

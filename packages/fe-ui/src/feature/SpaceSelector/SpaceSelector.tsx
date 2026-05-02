"use client";

import { usePersistStore } from "@cocrepo/store";
import {
	Avatar,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@cocrepo/ui/heroui";
import { Building2, Check, ChevronDown } from "lucide-react";
import { observer } from "mobx-react-lite";

export interface SpaceSelectorProps {
	/** Space 변경 시 콜백 (서버에 현재 Space를 반영한 뒤 상태를 갱신) */
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
		const canChangeSpace = typeof onChangeSpace === "function";

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

			// 현재 Space 반영은 상위에서 API 호출 및 store 동기화를 담당합니다.
			onChangeSpace?.(spaceId, groundName);
		};

		// Hydration 완료 전에는 렌더링하지 않음 (SSR/CSR 불일치 방지)
		if (!persistStore.isHydrated || !currentSpace) {
			return null;
		}

		// Space가 하나뿐이면 드롭다운 없이 표시
		if (spaces.length <= 1) {
			return (
				<div className="flex items-center gap-2 rounded-lg border border-default-200 bg-default-50 px-3 py-2">
					<Avatar
						icon={<Building2 className="h-4 w-4" size={16} />}
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
						isDisabled={!canChangeSpace}
						className="h-auto min-h-0 gap-2 bg-default-100 px-3 py-2 hover:bg-default-200"
					>
						<Avatar
							icon={<Building2 className="h-4 w-4" size={16} />}
							className="h-6 w-6 bg-primary-100 text-primary"
							size="sm"
						/>
						<span className="text-sm font-medium text-default-700">
							{currentSpace.name}
						</span>
						<ChevronDown className="h-4 w-4 text-default-400" size={16} />
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
							isDisabled={!canChangeSpace}
							startContent={
								<Avatar
									icon={<Building2 className="h-4 w-4" size={16} />}
									className="h-6 w-6 bg-default-100 text-default-600"
									size="sm"
								/>
							}
							endContent={
								space.spaceId === currentSpace.id ? (
									<Check className="h-4 w-4 text-primary" size={16} />
								) : null
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

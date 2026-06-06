"use client";

import { usePersistStore } from "@cocrepo/store";
import { Building2, Check, ChevronDown } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Avatar, Dropdown } from "@heroui/react";
import { Button } from "../../control/Button/Button";

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
				<div className="flex items-center gap-2 rounded-lg border border-border bg-default px-3 py-2">
					<Avatar
						className="h-6 w-6 bg-accent-soft text-accent"
						size="sm"
					>
						<Avatar.Fallback>
							<Building2 className="h-4 w-4" size={16} />
						</Avatar.Fallback>
					</Avatar>
					<span className="text-sm font-medium text-foreground">
						{currentSpace.name}
					</span>
				</div>
			);
		}

		return (
			<Dropdown>
				<Dropdown.Trigger>
					<Button
						variant="flat"
						isDisabled={!canChangeSpace}
						className="h-auto min-h-0 gap-2 bg-default px-3 py-2 hover:bg-default"
					>
						<Avatar
							className="h-6 w-6 bg-accent-soft text-accent"
							size="sm"
						>
							<Avatar.Fallback>
								<Building2 className="h-4 w-4" size={16} />
							</Avatar.Fallback>
						</Avatar>
						<span className="text-sm font-medium text-foreground">
							{currentSpace.name}
						</span>
						<ChevronDown className="h-4 w-4 text-muted" size={16} />
					</Button>
				</Dropdown.Trigger>
				<Dropdown.Popover placement="bottom end">
					<Dropdown.Menu aria-label="Space 선택" className="min-w-[200px]">
						{spaces.map((space) => (
							<Dropdown.Item
								id={space.spaceId}
								key={space.spaceId}
								isDisabled={!canChangeSpace}
								className={
									space.spaceId === currentSpace.id
										? "bg-accent-soft text-accent"
										: ""
								}
								onAction={() =>
									handleSelectSpace(space.spaceId, space.groundName)
								}
							>
								<span className="flex items-center gap-2">
									<Avatar
										className="h-6 w-6 bg-default text-muted"
										size="sm"
									>
										<Avatar.Fallback>
											<Building2 className="h-4 w-4" size={16} />
										</Avatar.Fallback>
									</Avatar>
									<span className="font-medium">{space.groundName}</span>
									{space.spaceId === currentSpace.id ? (
										<Check className="h-4 w-4 text-accent" size={16} />
									) : null}
								</span>
							</Dropdown.Item>
						))}
					</Dropdown.Menu>
				</Dropdown.Popover>
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

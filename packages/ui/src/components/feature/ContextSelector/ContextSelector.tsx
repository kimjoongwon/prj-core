"use client";

import { usePersistStore } from "@cocrepo/store";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { renderLucideIcon } from "../../../utils/iconUtils";

export interface ContextSelectorProps {
	/** 변경 버튼 텍스트 */
	changeText?: string;
	/** 변경 페이지 경로 */
	changePath?: string;
}

/**
 * ContextSelector Feature 컴포넌트
 * Header의 right 영역에 사용
 * 현재 선택된 Space/Context를 표시하고 변경 기능을 제공합니다.
 *
 * @example
 * ```tsx
 * <Header right={<><ContextSelector changeText="Space 변경" /><UserMenu /></>} />
 * ```
 */
export const ContextSelector = observer(
	({
		changeText = "변경하기",
		changePath = "/select-space",
	}: ContextSelectorProps) => {
		const persistStore = usePersistStore();

		// 현재 컨텍스트 정보
		const context =
			persistStore.spaceId && persistStore.spaceName
				? { id: persistStore.spaceId, name: persistStore.spaceName }
				: null;

		const handleChangeContext = () => {
			// 변경 페이지로 이동 (MenuStore의 navigate handler 사용)
			if (typeof window !== "undefined") {
				window.location.href = changePath;
			}
		};

		if (!context) {
			return null;
		}

		return (
			<Dropdown>
				<DropdownTrigger>
					<Button
						variant="bordered"
						size="sm"
						endContent={renderLucideIcon("ChevronDown", "h-4 w-4", 16)}
					>
						{context.name}
					</Button>
				</DropdownTrigger>
				<DropdownMenu aria-label="컨텍스트 선택">
					<DropdownItem
						key="change-context"
						startContent={renderLucideIcon("RefreshCw", "h-4 w-4", 16)}
						onPress={handleChangeContext}
					>
						{changeText}
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		);
	},
);

ContextSelector.displayName = "ContextSelector";

// 하위 호환성을 위한 타입 export
export interface ContextSelectorContext {
	id: string;
	name: string;
}

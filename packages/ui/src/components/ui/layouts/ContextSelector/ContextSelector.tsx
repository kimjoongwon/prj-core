import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { renderLucideIcon } from "../../../../utils";

/**
 * 컨텍스트 정보 인터페이스 (예: Ground, Tenant, Space 등)
 */
export interface ContextSelectorContext {
	id: string;
	name: string;
}

export interface ContextSelectorProps {
	/** 현재 컨텍스트 */
	context: ContextSelectorContext | null;
	/** 컨텍스트 변경 핸들러 */
	onChangeContext: () => void;
	/** 변경 버튼 텍스트 */
	changeText?: string;
}

/**
 * ContextSelector 컴포넌트
 * Header의 rightContent로 사용하는 컨텍스트 선택 드롭다운
 *
 * @example
 * ```tsx
 * <Header
 *   logo={<Logo />}
 *   rightContent={
 *     <>
 *       <ContextSelector context={currentContext} onChangeContext={onChangeContext} />
 *       <UserMenu user={currentUser} onLogout={onLogout} />
 *     </>
 *   }
 * >
 *   <Nav items={menuItems} onClickMenu={onClickMenu} />
 * </Header>
 * ```
 */
export const ContextSelector = observer<ContextSelectorProps>(
	({ context, onChangeContext, changeText = "변경하기" }) => {
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
						onPress={onChangeContext}
					>
						{changeText}
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		);
	},
);

ContextSelector.displayName = "ContextSelector";

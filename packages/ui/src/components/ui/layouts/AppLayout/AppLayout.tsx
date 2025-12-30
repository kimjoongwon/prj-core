import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { SubNav, type SubNavMenuItem } from "../SubNav";
import {
	TopNav,
	type TopNavContext,
	type TopNavMenuItem,
	type TopNavUser,
} from "../TopNav";

export interface AppLayoutProps {
	/** 주요 메뉴 아이템 */
	menuItems: TopNavMenuItem[];
	/** 하위 메뉴 아이템 (선택된 메뉴의 children) */
	subMenuItems?: SubNavMenuItem[];
	/** 현재 사용자 */
	currentUser: TopNavUser | null;
	/** 현재 컨텍스트 (선택적) */
	currentContext?: TopNavContext | null;
	/** 주요 메뉴 클릭 핸들러 */
	onClickMenu: (menuId: string) => void;
	/** 하위 메뉴 클릭 핸들러 */
	onClickSubMenu?: (menuId: string) => void;
	/** 컨텍스트 변경 핸들러 */
	onChangeContext?: () => void;
	/** 로그아웃 핸들러 */
	onLogout: () => void;
	/** 로고 클릭 핸들러 */
	onClickLogo?: () => void;
	/** 로고 아이콘 이름 */
	logoIcon?: string;
	/** 로고 텍스트 */
	logoText?: string;
	/** 컨텍스트 변경 텍스트 */
	changeContextText?: string;
	/** 추가 네비게이션 컨텐츠 */
	extraContent?: ReactNode;
	/** 페이지 콘텐츠 */
	children: ReactNode;
}

/**
 * AppLayout 컴포넌트
 * TopNav + SubNav + Content 영역을 조합한 범용 레이아웃
 *
 * 구성:
 * - TopNav: 상단 네비게이션 (로고 + 메뉴 + 사용자)
 * - SubNav: 하위 메뉴 (선택적)
 * - Content: 메인 콘텐츠 영역
 */
export const AppLayout = observer<AppLayoutProps>(
	({
		menuItems,
		subMenuItems,
		currentUser,
		currentContext,
		onClickMenu,
		onClickSubMenu,
		onChangeContext,
		onLogout,
		onClickLogo,
		logoIcon,
		logoText,
		changeContextText,
		extraContent,
		children,
	}) => {
		return (
			<div className="flex min-h-screen flex-col bg-background">
				{/* 상단 네비게이션 */}
				<TopNav
					menuItems={menuItems}
					currentUser={currentUser}
					currentContext={currentContext}
					onClickMenu={onClickMenu}
					onChangeContext={onChangeContext}
					onLogout={onLogout}
					onClickLogo={onClickLogo}
					logoIcon={logoIcon}
					logoText={logoText}
					changeContextText={changeContextText}
					extraContent={extraContent}
				/>

				{/* 하위 메뉴 네비게이션 */}
				{subMenuItems && subMenuItems.length > 0 && onClickSubMenu && (
					<SubNav menuItems={subMenuItems} onClickMenu={onClickSubMenu} />
				)}

				{/* 메인 콘텐츠 영역 */}
				<main className="flex-1 overflow-auto p-6">{children}</main>
			</div>
		);
	},
);

AppLayout.displayName = "AppLayout";

"use client";

import {
	AppLayout,
	ContextSelector,
	Header,
	Logo,
	Nav,
	SubNav,
	UserMenu,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

import { useAppLayout } from "../../src/hooks/useAppLayout";

/**
 * Admin 레이아웃
 * /admin/* 경로의 페이지에 AppLayout을 적용합니다.
 * (단, /admin/auth/*, /admin/select-space 제외)
 */
const AdminLayout = observer(({ children }: { children: React.ReactNode }) => {
	const {
		menuItems,
		subMenuItems,
		currentContext,
		currentUser,
		onClickMenu,
		onClickSubMenu,
		onChangeContext,
		onLogout,
		onClickLogo,
	} = useAppLayout();

	return (
		<AppLayout
			header={
				<Header
					logo={<Logo icon="LayoutGrid" text="Admin" onClick={onClickLogo} />}
					rightContent={
						<>
							{currentContext && (
								<ContextSelector
									context={currentContext}
									onChangeContext={onChangeContext}
									changeText="Space 변경"
								/>
							)}
							<UserMenu user={currentUser} onLogout={onLogout} />
						</>
					}
				>
					<Nav items={menuItems} onClickMenu={onClickMenu} />
				</Header>
			}
			subNav={
				subMenuItems.length > 0 ? (
					<SubNav menuItems={subMenuItems} onClickMenu={onClickSubMenu} />
				) : undefined
			}
		>
			{children}
		</AppLayout>
	);
});

export default AdminLayout;

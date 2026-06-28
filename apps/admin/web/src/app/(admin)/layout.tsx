import {
	AccessGate,
	Admin,
	FloatingAction,
	MobileBottomNavigation,
	MobileMenu,
	SideNavigation,
	TopBar,
} from "@cocrepo/ui";

/**
 * 인증 이후 관리자 route shell입니다.
 * Admin은 header/aside/main/footer 구조만 소유하고 feature wiring은 slot에 배치합니다.
 */
export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Admin>
			<Admin.Header>
				<TopBar />
			</Admin.Header>
			<Admin.Body>
				<Admin.LeftAside>
					<SideNavigation />
				</Admin.LeftAside>
				<Admin.Main>
					<AccessGate contents={children} />
				</Admin.Main>
			</Admin.Body>
			<Admin.Footer>
				<MobileMenu />
				<FloatingAction />
				<MobileBottomNavigation />
			</Admin.Footer>
		</Admin>
	);
}

import {
	AccessControlGuard,
	AccountTenantSelect,
	AccountUserMenu,
	LanguageSelectButton,
	SideNavigation,
	ThemeToggleButton,
} from "@cocrepo/ui";
import { Admin } from "@cocrepo/ui/layout";

const utilityButtonClassName =
	"h-10 w-10 rounded-lg border border-[#d7e4f2] bg-white text-foreground hover:bg-[#eef6ff] dark:border-white/10 dark:bg-neutral-900 dark:hover:bg-neutral-800";

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
				<div className="flex items-center gap-2">
					<LanguageSelectButton />
					<ThemeToggleButton compact className={utilityButtonClassName} />
					<AccountTenantSelect />
					<AccountUserMenu />
				</div>
			</Admin.Header>
			<Admin.Body>
				<Admin.LeftAside>
					<SideNavigation />
				</Admin.LeftAside>
				<Admin.Main>
					<AccessControlGuard contents={children} />
				</Admin.Main>
			</Admin.Body>
		</Admin>
	);
}

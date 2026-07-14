import {
	AccessControlGuard,
	AccountTenantSelect,
	AccountUserMenu,
	LanguageSelectButton,
	NavigationPanel,
	ThemeToggleButton,
} from "@cocrepo/ui";
import { Admin } from "@cocrepo/ui/layout";
import { AdminCopyrightFooter } from "./AdminCopyrightFooter";
import { PlateBrand } from "./PlateBrand";

const utilityButtonClassName =
	"h-10 w-10 rounded-xl border border-border bg-surface text-foreground shadow-none hover:bg-default/70";

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
				<PlateBrand />
				<div className="flex items-center gap-2">
					<LanguageSelectButton />
					<ThemeToggleButton compact className={utilityButtonClassName} />
					<AccountTenantSelect />
					<AccountUserMenu />
				</div>
			</Admin.Header>
			<Admin.Body>
				<Admin.LeftAside>
					<NavigationPanel />
				</Admin.LeftAside>
				<Admin.Main>
					<AccessControlGuard contents={children} />
				</Admin.Main>
			</Admin.Body>
			<Admin.Footer className="border-separator border-t bg-surface">
				<AdminCopyrightFooter />
			</Admin.Footer>
		</Admin>
	);
}

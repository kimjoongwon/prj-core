import { Auth, AuthBody, AuthMain } from "@cocrepo/ui/layout";

/**
 * 인증 전 route shell입니다.
 * Auth는 viewport와 centered content 구조만 소유합니다.
 */
export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Auth>
			<AuthBody>
				<AuthMain>{children}</AuthMain>
			</AuthBody>
		</Auth>
	);
}

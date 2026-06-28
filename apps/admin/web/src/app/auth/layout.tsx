import { Auth } from "@cocrepo/ui";

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
			<Auth.Body>
				<Auth.Main>{children}</Auth.Main>
			</Auth.Body>
		</Auth>
	);
}

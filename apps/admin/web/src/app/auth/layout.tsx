import { HStack, Typography } from "@cocrepo/ui";
import { Auth, AuthBody, AuthHeader, AuthMain } from "@cocrepo/ui/layout";
import Image from "next/image";

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
			<AuthHeader className="px-6 pt-6 sm:px-10 sm:pt-8">
				<HStack alignItems="center">
					<Image
						src="/admin/brand/plate-mark.svg"
						alt=""
						width={32}
						height={32}
						unoptimized
					/>
					<Typography
						className="text-xl font-extrabold tracking-[-0.035em]"
					>
						Plate
					</Typography>
				</HStack>
			</AuthHeader>
			<AuthBody>
				<AuthMain>{children}</AuthMain>
			</AuthBody>
		</Auth>
	);
}

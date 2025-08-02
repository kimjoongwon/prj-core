import { Card, CardBody } from "@heroui/react";
import type { ReactNode } from "react";

export interface DashboardLayoutProps {
	header?: ReactNode;
	leftSidebar?: ReactNode;
	rightSidebar?: ReactNode;
	bottom?: ReactNode;
	breadcrumb?: ReactNode;
	children: ReactNode;
}

import { observer } from "mobx-react-lite";
import { Text } from "../../ui/Text/Text";

export const DashboardLayout = observer((props: DashboardLayoutProps) => {
	const { header, leftSidebar, rightSidebar, bottom, breadcrumb, children } =
		props;

	const renderPlaceholder = (componentName: string) => (
		<Card className="h-full shadow-sm">
			<CardBody className="flex items-center justify-center">
				<div className="text-center space-y-2">
					<div className="w-12 h-12 mx-auto rounded-lg bg-default-100 flex items-center justify-center">
						<svg
							className="w-6 h-6 text-default-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
							/>
						</svg>
					</div>
					<Text variant="body2" className="text-default-500">
						{componentName}
					</Text>
				</div>
			</CardBody>
		</Card>
	);

	const headerElement = header || renderPlaceholder("HeaderComponent");

	return (
		<div className="flex flex-col h-screen bg-background">
			{/* Header */}
			<div className="flex-none backdrop-blur-lg bg-background/95 border-b border-divider sticky top-0 z-40">
				{headerElement}
			</div>

			{/* Main Layout */}
			<div className="flex flex-1 overflow-hidden">
				{/* Left Sidebar - Only rendered when leftSidebar is provided */}
				{leftSidebar && (
					<aside className="flex flex-col bg-content1 border-r border-divider transition-all duration-300 min-w-16">
						<div className="h-full overflow-y-auto scrollbar-thin">
							{leftSidebar}
						</div>
					</aside>
				)}

				{/* Main Content */}
				<main className="flex-1 flex flex-col overflow-hidden bg-content2">
					<div className="flex-1 overflow-y-auto scrollbar-thin">
						<div className="p-6">
							<Card className="min-h-full shadow-sm">
								<CardBody>
									{/* Breadcrumb Navigation */}
									{breadcrumb && (
										<div className="mb-4 sm:mb-6">{breadcrumb}</div>
									)}
									{children}
								</CardBody>
							</Card>
						</div>
					</div>
				</main>

				{/* Right Sidebar - Conditionally rendered when rightSidebar is provided */}
				{rightSidebar && (
					<aside className="hidden xl:flex w-72 flex-col bg-content1 border-l border-divider">
						<div className="h-full overflow-y-auto scrollbar-thin">
							<div className="p-4">{rightSidebar}</div>
						</div>
					</aside>
				)}
			</div>

			{/* Bottom Component - Only visible on mobile (below xl breakpoint) */}
			{bottom && (
				<div className="xl:hidden flex-none bg-content1 border-t border-divider">
					<div className="p-4">{bottom}</div>
				</div>
			)}
		</div>
	);
});

DashboardLayout.displayName = "DashboardLayout";

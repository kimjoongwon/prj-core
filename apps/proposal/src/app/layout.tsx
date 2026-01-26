"use client";

import { Providers } from "./providers";
import "./globals.css";
import { Tab, Tabs } from "@heroui/react";
import {
	Brain,
	Calendar,
	Database,
	FileText,
	GitBranch,
	Home,
	Image,
	LayoutDashboard,
	ListTree,
	Server,
	Target,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
	{ key: "/", label: "소개", icon: Home },
	{ key: "/dashboard", label: "대시보드", icon: LayoutDashboard },
	{ key: "/wbs", label: "WBS", icon: ListTree },
	{ key: "/requirements", label: "요구사항", icon: FileText },
	{ key: "/screens", label: "화면 설계", icon: Target },
	{ key: "/api", label: "API 설계", icon: Server },
	{ key: "/database", label: "DB 설계", icon: Database },
	{ key: "/milestones", label: "마일스톤", icon: GitBranch },
	{ key: "/schedule", label: "일정", icon: Calendar },
	{ key: "/image-gen", label: "이미지 생성", icon: Image },
] as const;

/**
 * 루트 레이아웃
 * 공통 헤더와 탭 네비게이션 포함
 */
const RootLayout = observer(({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();

	// 현재 경로에 맞는 탭 키 찾기
	const currentTab = tabs.find((tab) => tab.key === pathname)?.key ?? "/";

	return (
		<html lang="ko" className="dark">
			<head>
				<title>제대로 만드는 사람들</title>
				<meta name="description" content="기획부터 배포까지, 빈틈없는 완성도" />
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
				/>
			</head>
			<body className="bg-black text-foreground antialiased">
				<Providers>
					<div className="relative min-h-screen">
						{/* 배경 블러 오브 */}
						<div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />
						<div className="fixed top-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-70 pointer-events-none" />

						{/* 헤더 */}
						<header className="border-b border-divider bg-background/60 backdrop-blur-md sticky top-0 z-50">
							<div className="max-w-7xl mx-auto px-6 py-4">
								<div className="flex items-center gap-3">
									<Brain className="w-8 h-8 text-primary" />
									<div>
										<h1 className="text-xl font-bold">
											<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
												AI 주도 기획
											</span>
										</h1>
										<p className="text-xs text-default-500">
											Proposal & Planning Dashboard
										</p>
									</div>
								</div>
							</div>
						</header>

						{/* 메인 컨텐츠 */}
						<main className="max-w-7xl mx-auto px-6 py-8">
							{/* 탭 네비게이션 */}
							<Tabs
								aria-label="기획 메뉴"
								selectedKey={currentTab}
								color="primary"
								variant="underlined"
								classNames={{
									tabList:
										"gap-6 w-full relative rounded-none p-0 border-b border-divider",
									cursor: "w-full bg-primary",
									tab: "max-w-fit px-0 h-12",
									tabContent: "group-data-[selected=true]:text-primary",
								}}
							>
								{tabs.map((tab) => (
									<Tab
										key={tab.key}
										title={
											<Link
												href={tab.key as "/"}
												className="flex items-center gap-2 py-2"
											>
												<tab.icon className="w-4 h-4" />
												<span>{tab.label}</span>
											</Link>
										}
									/>
								))}
							</Tabs>

							{/* 페이지 컨텐츠 */}
							{children}
						</main>
					</div>
				</Providers>
			</body>
		</html>
	);
});

export default RootLayout;

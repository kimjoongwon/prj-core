"use client";

import { Button, Card, CardBody, Chip, Divider } from "@heroui/react";
import {
	ArrowRight,
	CheckCircle,
	Cloud,
	Code2,
	GitBranch,
	Layers,
	Lightbulb,
	Rocket,
	Server,
	Shield,
	Target,
	Users,
	Zap,
} from "lucide-react";
import { observer } from "mobx-react-lite";

/**
 * 소개 페이지 (랜딩 페이지)
 */
const IntroPage = observer(() => {
	return (
		<div className="py-8 space-y-16">
			{/* Hero 섹션 */}
			<HeroSection />

			{/* 회사 소개 섹션 */}
			<AboutSection />

			{/* 기술 스택 섹션 */}
			<TechStackSection />

			{/* Footer */}
			<Footer />
		</div>
	);
});

export default IntroPage;

function HeroSection() {
	return (
		<section className="text-center py-16">
			<Chip
				color="primary"
				variant="flat"
				size="lg"
				className="mb-6"
				startContent={<Rocket className="w-4 h-4" />}
			>
				Software Development Partner
			</Chip>

			<h2 className="text-5xl md:text-7xl font-bold mb-6">
				<span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
					제대로 만드는 사람들
				</span>
			</h2>

			<p className="text-xl md:text-2xl text-default-600 mb-8">
				기획부터 배포까지, 빈틈없는 완성도
			</p>

			<p className="text-lg text-default-500 mb-12 max-w-2xl mx-auto">
				검증된 기술 스택과 체계적인 개발 프로세스로
				<br />
				비즈니스 성공을 위한 최적의 솔루션을 제공합니다.
			</p>

			<div className="flex flex-col sm:flex-row gap-4 justify-center">
				<Button
					color="primary"
					size="lg"
					endContent={<ArrowRight className="w-5 h-5" />}
					className="font-semibold"
				>
					프로젝트 문의하기
				</Button>
				<Button
					variant="bordered"
					size="lg"
					className="font-semibold border-default-300"
				>
					포트폴리오 보기
				</Button>
			</div>
		</section>
	);
}

function AboutSection() {
	const values = [
		{
			icon: <Target className="w-8 h-8" />,
			title: "명확한 목표 설정",
			description:
				"프로젝트 시작 전 비즈니스 목표와 기술 요구사항을 명확히 정의하여 방향성을 확립합니다.",
		},
		{
			icon: <Shield className="w-8 h-8" />,
			title: "안정적인 품질",
			description:
				"코드 리뷰, 자동화 테스트, CI/CD 파이프라인으로 일관된 품질을 보장합니다.",
		},
		{
			icon: <Zap className="w-8 h-8" />,
			title: "빠른 실행력",
			description:
				"애자일 방법론과 최신 개발 도구로 빠르고 유연하게 대응합니다.",
		},
		{
			icon: <Users className="w-8 h-8" />,
			title: "긴밀한 소통",
			description:
				"투명한 진행 상황 공유와 정기적인 미팅으로 신뢰를 구축합니다.",
		},
	];

	return (
		<section>
			<div className="text-center mb-12">
				<Chip color="secondary" variant="flat" className="mb-4">
					About Us
				</Chip>
				<h3 className="text-3xl md:text-4xl font-bold mb-4">
					우리가 일하는 방식
				</h3>
				<p className="text-default-600 text-lg max-w-2xl mx-auto">
					기술적 완성도와 비즈니스 가치, 두 마리 토끼를 모두 잡습니다.
				</p>
			</div>

			<div className="grid md:grid-cols-2 gap-6">
				{values.map((value) => (
					<Card key={value.title} className="bg-content1 shadow-sm">
						<CardBody className="p-6">
							<div className="flex gap-4">
								<div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
									{value.icon}
								</div>
								<div>
									<h4 className="text-xl font-semibold mb-2">{value.title}</h4>
									<p className="text-default-500">{value.description}</p>
								</div>
							</div>
						</CardBody>
					</Card>
				))}
			</div>

			{/* 비전 카드 */}
			<Card className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 border border-divider">
				<CardBody className="p-8 text-center">
					<Lightbulb className="w-12 h-12 mx-auto mb-4 text-primary" />
					<h4 className="text-2xl font-bold mb-4">Our Vision</h4>
					<p className="text-lg text-default-600 max-w-3xl mx-auto">
						&ldquo;완벽한 코드보다 완벽한 솔루션을 추구합니다.&rdquo;
						<br />
						<span className="text-default-500 text-base mt-2 block">
							기술은 도구일 뿐, 진정한 가치는 고객의 비즈니스 성공에 있습니다.
						</span>
					</p>
				</CardBody>
			</Card>
		</section>
	);
}

function TechStackSection() {
	const techStacks = [
		{
			category: "Frontend",
			icon: <Code2 className="w-6 h-6" />,
			color: "primary" as const,
			techs: [
				{ name: "Next.js", description: "React 기반 풀스택 프레임워크" },
				{ name: "React", description: "컴포넌트 기반 UI 라이브러리" },
				{ name: "TypeScript", description: "타입 안전성 확보" },
				{ name: "Tailwind CSS", description: "유틸리티 기반 스타일링" },
			],
		},
		{
			category: "Backend",
			icon: <Server className="w-6 h-6" />,
			color: "secondary" as const,
			techs: [
				{ name: "NestJS", description: "엔터프라이즈급 Node.js 프레임워크" },
				{ name: "Prisma", description: "타입 안전 ORM" },
				{ name: "PostgreSQL", description: "관계형 데이터베이스" },
				{ name: "Redis", description: "캐싱 및 세션 관리" },
			],
		},
		{
			category: "Infrastructure",
			icon: <Cloud className="w-6 h-6" />,
			color: "success" as const,
			techs: [
				{ name: "Docker", description: "컨테이너화" },
				{ name: "Kubernetes", description: "컨테이너 오케스트레이션" },
				{ name: "AWS", description: "클라우드 인프라" },
				{ name: "Vercel", description: "프론트엔드 배포 플랫폼" },
			],
		},
		{
			category: "DevOps",
			icon: <GitBranch className="w-6 h-6" />,
			color: "warning" as const,
			techs: [
				{ name: "Jenkins", description: "CI/CD 파이프라인" },
				{ name: "GitHub Actions", description: "자동화 워크플로우" },
				{ name: "Turborepo", description: "모노레포 빌드 시스템" },
				{ name: "Biome", description: "린트 및 포맷팅" },
			],
		},
	];

	return (
		<section className="py-8 px-6 -mx-6 bg-content1/30 rounded-xl">
			<div className="text-center mb-12">
				<Chip color="primary" variant="flat" className="mb-4">
					Tech Stack
				</Chip>
				<h3 className="text-3xl md:text-4xl font-bold mb-4">
					검증된 기술 스택
				</h3>
				<p className="text-default-600 text-lg max-w-2xl mx-auto">
					최신 기술과 안정성을 동시에 확보한 기술 스택으로 프로젝트를
					진행합니다.
				</p>
			</div>

			<div className="grid md:grid-cols-2 gap-6">
				{techStacks.map((stack) => (
					<Card key={stack.category} className="bg-content1 shadow-sm h-full">
						<CardBody className="p-6">
							<div className="flex items-center gap-3 mb-4">
								<div
									className={`w-10 h-10 rounded-lg bg-${stack.color}/10 flex items-center justify-center text-${stack.color}`}
								>
									{stack.icon}
								</div>
								<h4 className="text-xl font-semibold">{stack.category}</h4>
							</div>
							<Divider className="mb-4" />
							<div className="space-y-3">
								{stack.techs.map((tech) => (
									<div key={tech.name} className="flex items-start gap-2">
										<CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
										<div>
											<span className="font-medium">{tech.name}</span>
											<span className="text-default-500 text-sm ml-2">
												- {tech.description}
											</span>
										</div>
									</div>
								))}
							</div>
						</CardBody>
					</Card>
				))}
			</div>

			{/* 개발 프로세스 */}
			<Card className="mt-12 bg-content1 shadow-sm">
				<CardBody className="p-8">
					<div className="flex items-center gap-3 mb-6">
						<Layers className="w-8 h-8 text-primary" />
						<h4 className="text-2xl font-bold">개발 프로세스</h4>
					</div>
					<div className="grid md:grid-cols-5 gap-4">
						{[
							{ step: "01", title: "요구사항 분석", desc: "비즈니스 이해" },
							{ step: "02", title: "설계", desc: "아키텍처 설계" },
							{ step: "03", title: "개발", desc: "애자일 스프린트" },
							{ step: "04", title: "테스트", desc: "품질 검증" },
							{ step: "05", title: "배포", desc: "안정적 릴리스" },
						].map((process, index) => (
							<div key={process.step} className="text-center">
								<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
									<span className="text-primary font-bold">{process.step}</span>
								</div>
								<h5 className="font-semibold mb-1">{process.title}</h5>
								<p className="text-default-500 text-sm">{process.desc}</p>
								{index < 4 && (
									<ArrowRight className="w-5 h-5 text-default-300 mx-auto mt-3 hidden md:block" />
								)}
							</div>
						))}
					</div>
				</CardBody>
			</Card>
		</section>
	);
}

function Footer() {
	return (
		<footer className="py-8 border-t border-divider">
			<div className="flex flex-col md:flex-row justify-between items-center gap-4">
				<div className="text-center md:text-left">
					<h4 className="text-xl font-bold mb-1">
						<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
							제대로 만드는 사람들
						</span>
					</h4>
					<p className="text-default-500 text-sm">
						기획부터 배포까지, 빈틈없는 완성도
					</p>
				</div>
				<div className="text-center md:text-right">
					<p className="text-default-500 text-sm">
						&copy; 2025 제대로 만드는 사람들. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}

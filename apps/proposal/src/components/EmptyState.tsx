"use client";

import { Card, CardBody, CardHeader, Chip } from "@heroui/react";

interface EmptyStateProps {
	title: string;
	description: string;
}

/**
 * 빈 상태 컴포넌트
 * 아직 구현되지 않은 페이지에 표시
 */
export function EmptyState({ title, description }: EmptyStateProps) {
	return (
		<Card className="bg-content1/50 border border-divider">
			<CardHeader className="pb-0">
				<h2 className="text-2xl font-bold">{title}</h2>
			</CardHeader>
			<CardBody>
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<div className="w-16 h-16 rounded-full bg-default-100 flex items-center justify-center mb-4">
						<Chip color="default" variant="flat" size="sm">
							준비 중
						</Chip>
					</div>
					<p className="text-default-500 mb-2">{description}</p>
					<p className="text-default-400 text-sm">
						이 영역은 기능 구현 전 빈 상태입니다.
					</p>
				</div>
			</CardBody>
		</Card>
	);
}

"use client";

import { PageSurface, SectionSurface } from "@cocrepo/ui";
import { Button } from "@cocrepo/ui";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Chip,
	Snippet,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import type { AIFormTemplate } from "@cocrepo/type";

// 임시 더미 데이터
const mockTemplates: AIFormTemplate[] = [
	{
		id: "1",
		spaceId: "space-1",
		name: "고객 문의 답변용",
		description: "고객 문의에 대한 친절한 답변을 생성하는 템플릿",
		targetDomain: "Inquiry",
		targetEntity: "InquiryResponse",
		aiProvider: "OPENAI",
		model: "gpt-4o",
		status: "ACTIVE",
		priority: 1,
		allowUserPrompt: true,
		createdAt: new Date(),
		updatedAt: null,
		removedAt: null,
	},
	{
		id: "2",
		spaceId: "space-1",
		name: "회원 정보 요약",
		description: "회원 정보를 요약하여 정리하는 템플릿",
		targetDomain: "Member",
		targetEntity: "Member",
		aiProvider: "ANTHROPIC",
		model: "claude-3-5-sonnet-20241022",
		status: "DRAFT",
		priority: 2,
		allowUserPrompt: true,
		createdAt: new Date(),
		updatedAt: null,
		removedAt: null,
	},
];

const statusColorMap: Record<string, "success" | "warning" | "danger" | "default"> = {
	ACTIVE: "success",
	INACTIVE: "warning",
	DRAFT: "default",
	ARCHIVED: "danger",
};

const statusLabelMap: Record<string, string> = {
	ACTIVE: "활성",
	INACTIVE: "비활성",
	DRAFT: "초안",
	ARCHIVED: "보관",
};

const providerColorMap: Record<string, "primary" | "secondary"> = {
	OPENAI: "primary",
	ANTHROPIC: "secondary",
};

export const AIFormTemplatesClient = observer(function AIFormTemplatesClient() {
	const router = useRouter();

	const onClickCreate = () => {
		router.push("/ai-form-templates/new");
	};

	const onClickRow = (id: string) => {
		router.push(\`/ai-form-templates/\${id}\`);
	};

	return (
		<PageSurface
			title="AI 폼 템플릿"
			description="AI가 폼 필드를 자동으로 채우기 위한 템플릿을 관리합니다."
			actions={
				<Button color="primary" onPress={onClickCreate}>
					템플릿 등록
				</Button>
			}
		>
			<SectionSurface>
				<Table
					aria-label="AI 폼 템플릿 목록"
					onRowAction={(key) => onClickRow(key as string)}
					selectionMode="single"
				>
					<TableHeader>
						<TableColumn key="name">템플릿명</TableColumn>
						<TableColumn key="targetDomain">대상 도메인</TableColumn>
						<TableColumn key="aiProvider">AI 제공자</TableColumn>
						<TableColumn key="status">상태</TableColumn>
						<TableColumn key="priority">우선순위</TableColumn>
					</TableHeader>
					<TableBody items={mockTemplates}>
						{(item) => (
							<TableRow key={item.id}>
								<TableCell>
									<div className="flex flex-col">
										<span className="font-medium">{item.name}</span>
										{item.description && (
											<span className="text-small text-default-500">
												{item.description}
											</span>
										)}
									</div>
								</TableCell>
								<TableCell>
									<Snippet hideSymbol variant="flat" size="sm">
										{item.targetDomain}
									</Snippet>
								</TableCell>
								<TableCell>
									<Chip size="sm" color={providerColorMap[item.aiProvider] || "default"} variant="flat">
										{item.aiProvider === "OPENAI" ? "OpenAI" : "Anthropic"}
									</Chip>
								</TableCell>
								<TableCell>
									<Chip size="sm" color={statusColorMap[item.status]} variant="flat">
										{statusLabelMap[item.status]}
									</Chip>
								</TableCell>
								<TableCell>{item.priority}</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</SectionSurface>
		</PageSurface>
	);
});

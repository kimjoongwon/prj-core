"use client";

import { useGetTemplates } from "@cocrepo/api";
import { Button, PageSurface, SectionSurface } from "@cocrepo/ui";
import {
	Chip,
	Snippet,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface AIFormTemplateRow {
	id: string;
	name: string;
	description?: string | null;
	targetDomain: string;
	aiProvider: "OPENAI" | "ANTHROPIC";
	status: "ACTIVE" | "INACTIVE" | "DRAFT" | "ARCHIVED";
	priority: number;
}

const statusColorMap: Record<
	string,
	"success" | "warning" | "danger" | "default"
> = {
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

const toAIFormTemplateRows = (
	templates: Array<{
		id: string;
		name: string;
		description?: string | null;
		code: string;
		type: string;
		isActive: boolean;
	}>,
): AIFormTemplateRow[] => {
	return templates.map((template, index) => ({
		id: template.id,
		name: template.name,
		description: template.description,
		targetDomain: template.type,
		aiProvider: template.code.startsWith("ANTHROPIC") ? "ANTHROPIC" : "OPENAI",
		status: template.isActive ? "ACTIVE" : "INACTIVE",
		priority: index + 1,
	}));
};

export const AIFormTemplatesClient = observer(function AIFormTemplatesClient() {
	const router = useRouter();
	const { data: response, isLoading } = useGetTemplates({ take: 20, skip: 0 });
	const templates = toAIFormTemplateRows(response?.data ?? []);

	const onClickCreate = () => {
		router.push("/ai-form-templates/new" as Route);
	};

	const onClickRow = (id: string) => {
		router.push(`/ai-form-templates/${id}` as Route);
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
					<TableBody
						items={templates}
						isLoading={isLoading}
						loadingContent={<Spinner size="sm" label="불러오는 중..." />}
						emptyContent="등록된 템플릿이 없습니다."
					>
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
									<Chip
										size="sm"
										color={providerColorMap[item.aiProvider] || "default"}
										variant="flat"
									>
										{item.aiProvider === "OPENAI" ? "OpenAI" : "Anthropic"}
									</Chip>
								</TableCell>
								<TableCell>
									<Chip
										size="sm"
										color={statusColorMap[item.status]}
										variant="flat"
									>
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

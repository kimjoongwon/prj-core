"use client";

import type { TemplateDto } from "@cocrepo/api";
import { useDeleteTemplate, useGetTemplate } from "@cocrepo/api";
import { DateCell, PageSurface, SectionSurface, VStack } from "@cocrepo/ui";
import { Button, Card, CardBody, Chip, Spinner } from "@heroui/react";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface AIFormTemplateDetailPageClientProps {
	templateId: string;
}

interface TemplateVariableLike {
	id: string;
	name: string;
	description?: string | null;
	defaultValue?: string | null;
	isRequired?: boolean;
}

interface AIFormField {
	id: string;
	fieldName: string;
	fieldLabel: string;
	prompt: string;
	isRequired: boolean;
	order: number;
	defaultValue: string | null;
	validationRegex: string | null;
	validationMessage: string | null;
	maxLength: number | null;
}

type TemplateWithVariables = TemplateDto & {
	variables?: TemplateVariableLike[];
};

const getStatusColor = (status: string) => {
	switch (status) {
		case "ACTIVE":
			return "success";
		case "DRAFT":
			return "warning";
		case "INACTIVE":
			return "default";
		case "ARCHIVED":
			return "secondary";
		default:
			return "default";
	}
};

const getStatusLabel = (status: string) => {
	switch (status) {
		case "ACTIVE":
			return "활성화";
		case "DRAFT":
			return "초안";
		case "INACTIVE":
			return "비활성화";
		case "ARCHIVED":
			return "보관됨";
		default:
			return "알 수 없음";
	}
};

function AIFormTemplateDetailPageClient({
	templateId,
}: AIFormTemplateDetailPageClientProps) {
	const router = useRouter();
	const { data: response, isLoading } = useGetTemplate(templateId);
	const deleteTemplate = useDeleteTemplate();
	const template = response?.data as TemplateWithVariables | undefined;

	const onClickBackButton = () => {
		router.push("/ai-form-templates" as Route);
	};

	const onClickEditButton = () => {
		router.push(`/ai-form-templates/${templateId}/edit` as Route);
	};

	const onClickDeleteButton = async () => {
		await deleteTemplate.mutateAsync({ templateId });
		router.push("/ai-form-templates" as Route);
	};

	if (isLoading) {
		return (
			<PageSurface title="AI 폼 템플릿 상세" description="로딩 중...">
				<div className="flex items-center justify-center p-8">
					<Spinner size="lg" label="데이터 로딩 중..." />
				</div>
			</PageSurface>
		);
	}

	if (!template) {
		return (
			<PageSurface
				title="AI 폼 템플릿 상세"
				description="템플릿을 찾을 수 없습니다."
			>
				<div className="flex items-center justify-center p-8">
					<Button variant="light" onPress={onClickBackButton}>
						목록으로
					</Button>
				</div>
			</PageSurface>
		);
	}

	const status = template.isActive ? "ACTIVE" : "INACTIVE";
	const provider = template.code.startsWith("ANTHROPIC")
		? "ANTHROPIC"
		: "OPENAI";
	const fields: AIFormField[] = (template.variables ?? []).map(
		(variable, index) => ({
			id: variable.id,
			fieldName: variable.name,
			fieldLabel: variable.name,
			prompt: variable.description ?? "",
			isRequired: variable.isRequired ?? false,
			order: index,
			defaultValue: variable.defaultValue ?? null,
			validationRegex: null,
			validationMessage: null,
			maxLength: null,
		}),
	);

	return (
		<PageSurface
			title={template.name}
			description={template.description || "AI 폼 템플릿 상세 정보"}
			actions={
				<div className="flex gap-2">
					<Button
						variant="light"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={onClickBackButton}
					>
						목록으로
					</Button>
					<Button
						color="primary"
						startContent={<Edit className="h-4 w-4" />}
						onPress={onClickEditButton}
					>
						수정
					</Button>
					<Button
						color="danger"
						variant="flat"
						startContent={<Trash2 className="h-4 w-4" />}
						onPress={onClickDeleteButton}
					>
						삭제
					</Button>
				</div>
			}
		>
			<VStack gap={4}>
				<SectionSurface title="기본 정보">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
						<div>
							<p className="text-xs text-default-400">코드</p>
							<p className="text-sm font-medium">{template.code}</p>
						</div>
						<div>
							<p className="text-xs text-default-400">유형</p>
							<p className="text-sm font-medium">{template.type}</p>
						</div>
						<div>
							<p className="text-xs text-default-400">AI 제공자</p>
							<p className="text-sm font-medium">
								{provider === "OPENAI" ? "OpenAI" : "Anthropic"}
							</p>
						</div>
						<div>
							<p className="text-xs text-default-400">상태</p>
							<Chip size="sm" color={getStatusColor(status)} variant="flat">
								{getStatusLabel(status)}
							</Chip>
						</div>
						<div>
							<p className="text-xs text-default-400">필드 수</p>
							<p className="text-sm font-medium">{fields.length}개</p>
						</div>
						<div>
							<p className="text-xs text-default-400">생성 일시</p>
							<DateCell value={template.createdAt} />
						</div>
						<div>
							<p className="text-xs text-default-400">수정 일시</p>
							<DateCell value={template.updatedAt} />
						</div>
					</div>
				</SectionSurface>

				{template.subject && (
					<SectionSurface title="제목(Subject)">
						<div className="p-4">
							<p className="text-sm whitespace-pre-wrap">{template.subject}</p>
						</div>
					</SectionSurface>
				)}

				<SectionSurface title="시스템 프롬프트/본문">
					<div className="p-4">
						<div className="bg-default-100 dark:bg-default-50/10 rounded-lg p-4">
							<p className="text-sm whitespace-pre-wrap">{template.content}</p>
						</div>
					</div>
				</SectionSurface>

				<SectionSurface
					title="폼 필드"
					subtitle={`AI가 채울 필드 (${fields.length}개)`}
				>
					<div className="p-4 space-y-4">
						{fields.length === 0 ? (
							<div className="text-center py-8 text-default-400">
								<p>등록된 필드가 없습니다.</p>
							</div>
						) : (
							fields.map((field, index) => (
								<Card key={field.id} shadow="sm">
									<CardBody className="p-4">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-2">
													<span className="text-xs text-default-400">
														#{index + 1}
													</span>
													<span className="font-medium">
														{field.fieldLabel}
													</span>
													<span className="text-xs text-default-400">
														({field.fieldName})
													</span>
													{field.isRequired && (
														<Chip size="sm" color="warning" variant="flat">
															필수
														</Chip>
													)}
												</div>
												<p className="text-sm text-default-600 mb-2">
													{field.prompt || "설명 없음"}
												</p>
											</div>
										</div>
									</CardBody>
								</Card>
							))
						)}
					</div>
				</SectionSurface>
			</VStack>
		</PageSurface>
	);
}

export default observer(AIFormTemplateDetailPageClient);

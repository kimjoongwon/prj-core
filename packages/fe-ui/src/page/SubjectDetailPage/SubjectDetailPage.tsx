"use client";

import {
	BooleanCell,
	DateTimeCell,
	DefaultCell,
	DetailPage,
	DetailPageSurface,
	PageTitleBar,
	DetailSection,
	DetailSectionCard,
	VStack,
} from "@cocrepo/ui";
import {
	Button,
	Chip,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@cocrepo/ui/heroui";
import { ArrowLeft, Box } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";

export interface SubjectDetailPageSubject {
	name: string;
	displayName?: string | null;
	icon?: string | null;
	group?: string | null;
	order: number;
	isSystem: boolean;
	createdAt: string | Date | null;
	updatedAt?: string | Date | null;
}

export interface SubjectDetailPageField {
	name: string;
	displayName?: string | null;
	type: string;
	isRequired: boolean;
	isRelation: boolean;
}

export interface SubjectDetailPageProps {
	subject?: SubjectDetailPageSubject;
	subjectFields: SubjectDetailPageField[];
	isLoading: boolean;
	isFieldsLoading: boolean;
	onClickBackButton: () => void;
}

/**
 * group별 Chip 색상 반환
 */
function getGroupColor(
	group?: string,
): "primary" | "secondary" | "success" | "warning" | "default" {
	switch (group) {
		case "entity":
			return "primary";
		case "menu":
			return "secondary";
		case "feature":
			return "success";
		case "ui":
			return "warning";
		default:
			return "default";
	}
}

/**
 * Subject 상세 정보 표시 컴포넌트
 */
function SubjectInfoSection({
	subject,
}: {
	subject: SubjectDetailPageSubject;
}) {
	return (
		<DetailSectionCard>
			<DetailSection top={<PageTitleBar level={2} title="기본 정보" />}>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<div className="mb-1 text-sm text-default-500">식별자</div>
						<div className="font-medium">{subject.name}</div>
					</div>
					<div>
						<div className="mb-1 text-sm text-default-500">표시명</div>
						<div className="font-medium">
							<DefaultCell value={subject.displayName || "-"} />
						</div>
					</div>
					<div>
						<div className="mb-1 text-sm text-default-500">아이콘</div>
						<div className="font-medium">
							<DefaultCell value={subject.icon || "-"} />
						</div>
					</div>
					<div>
						<div className="mb-1 text-sm text-default-500">분류</div>
						<div>
							{subject.group ? (
								<Chip
									color={getGroupColor(subject.group)}
									size="sm"
									variant="flat"
								>
									{subject.group}
								</Chip>
							) : (
								<DefaultCell value="-" />
							)}
						</div>
					</div>
					<div>
						<div className="mb-1 text-sm text-default-500">정렬 순서</div>
						<div className="font-medium">{subject.order}</div>
					</div>
					<div>
						<div className="mb-1 text-sm text-default-500">시스템</div>
						<div>
							<BooleanCell value={subject.isSystem} />
						</div>
					</div>
					<div>
						<div className="mb-1 text-sm text-default-500">생성일</div>
						<div className="font-medium">
							<DateTimeCell value={subject.createdAt} />
						</div>
					</div>
					<div>
						<div className="mb-1 text-sm text-default-500">수정일</div>
						<div className="font-medium">
							<DateTimeCell value={subject.updatedAt || "-"} />
						</div>
					</div>
				</div>
			</DetailSection>
		</DetailSectionCard>
	);
}

/**
 * Subject 필드 목록 표시 컴포넌트
 */
function SubjectFieldsSection({
	group,
	subjectFields,
	isLoading,
}: {
	group?: string | null;
	subjectFields: SubjectDetailPageField[];
	isLoading: boolean;
}) {
	let content: ReactNode;

	// entity 그룹이 아닌 경우
	if (group !== "entity") {
		content = (
			<div className="rounded-xl bg-default-100 p-8 text-center">
				<Box className="mx-auto mb-4 size-12 text-default-400" />
				<p className="text-default-500">
					이 Subject는 Entity 기반이 아니므로 필드 정보가 없습니다.
				</p>
			</div>
		);
	} else if (isLoading) {
		// 로딩 중
		content = (
			<div className="flex items-center justify-center p-8">
				<Spinner />
			</div>
		);
	} else {
		content = (
			<Table aria-label="Subject 필드 목록">
				<TableHeader>
					<TableColumn>필드명</TableColumn>
					<TableColumn>표시명</TableColumn>
					<TableColumn>타입</TableColumn>
					<TableColumn align="center">필수</TableColumn>
					<TableColumn align="center">관계</TableColumn>
				</TableHeader>
				<TableBody items={subjectFields} emptyContent="조회된 필드가 없습니다.">
					{(field) => (
						<TableRow key={field.name}>
							<TableCell>{field.name}</TableCell>
							<TableCell>
								<DefaultCell value={field.displayName || "-"} />
							</TableCell>
							<TableCell>
								<code className="text-xs">{field.type}</code>
							</TableCell>
							<TableCell>
								<div className="flex justify-center">
									<BooleanCell value={field.isRequired} />
								</div>
							</TableCell>
							<TableCell>
								<div className="flex justify-center">
									<BooleanCell value={field.isRelation} />
								</div>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		);
	}

	return (
		<DetailSectionCard>
			<DetailSection top={<PageTitleBar level={2} title="필드 목록" />}>
				{content}
			</DetailSection>
		</DetailSectionCard>
	);
}

export const SubjectDetailPage = observer(
	({
		subject,
		subjectFields,
		isLoading,
		isFieldsLoading,
		onClickBackButton,
	}: SubjectDetailPageProps) => {
		if (isLoading) {
			return (
				<DetailPage
					top={<PageTitleBar title="Subject 상세" description="로딩 중..." />}
				>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex items-center justify-center p-8">
								<Spinner size="lg" />
							</div>
						</DetailSectionCard>
					</DetailPageSurface>
				</DetailPage>
			);
		}

		if (!subject) {
			const pageHeader = (
				<PageTitleBar
					title="Subject 상세"
					description="Subject를 찾을 수 없습니다."
				/>
			);

			return (
				<DetailPage top={pageHeader}>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-default-500">Subject를 찾을 수 없습니다.</p>
								<Button
									variant="flat"
									startContent={<ArrowLeft className="size-4" />}
									onPress={onClickBackButton}
								>
									목록으로
								</Button>
							</div>
						</DetailSectionCard>
					</DetailPageSurface>
				</DetailPage>
			);
		}

		const pageHeader = (
			<PageTitleBar
				title="Subject 상세"
				description="Subject의 상세 정보를 조회합니다."
				actions={
					<Button
						variant="flat"
						startContent={<ArrowLeft className="size-4" />}
						onPress={onClickBackButton}
					>
						목록으로
					</Button>
				}
			/>
		);

		return (
			<DetailPage top={pageHeader}>
				<DetailPageSurface>
					<VStack gap={4}>
						<SubjectInfoSection subject={subject} />
						<SubjectFieldsSection
							group={subject.group}
							subjectFields={subjectFields}
							isLoading={isFieldsLoading}
						/>
					</VStack>
				</DetailPageSurface>
			</DetailPage>
		);
	},
);

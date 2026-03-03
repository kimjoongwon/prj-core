"use client";

import {
	getSubjectFields,
	type SubjectDto,
	type SubjectFieldDto,
	useGetSubjectById,
} from "@cocrepo/api";
import {
	BooleanCell,
	DateTimeCell,
	DefaultCell,
	Page,
	PageHeader,
	Section,
	SectionHeader,
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
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Box } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

interface SubjectDetailPageClientProps {
	subjectId: string;
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
function SubjectInfoSection({ subject }: { subject: SubjectDto }) {
	return (
		<Section top={<SectionHeader title="기본 정보" />}>
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
		</Section>
	);
}

/**
 * Subject 필드 목록 표시 컴포넌트
 */
function SubjectFieldsSection({
	subjectId,
	group,
}: {
	subjectId: string;
	group?: string;
}) {
	// entity 그룹이 아니면 필드 조회 스킵
	const { data: fields, isLoading } = useQuery({
		queryKey: ["subject-fields", subjectId],
		queryFn: () => getSubjectFields(subjectId),
		enabled: group === "entity",
	});

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
		// 필드 데이터 추출
		const fieldList: SubjectFieldDto[] = fields?.data ?? [];
		content = (
			<Table aria-label="Subject 필드 목록">
				<TableHeader>
					<TableColumn>필드명</TableColumn>
					<TableColumn>표시명</TableColumn>
					<TableColumn>타입</TableColumn>
					<TableColumn align="center">필수</TableColumn>
					<TableColumn align="center">관계</TableColumn>
				</TableHeader>
				<TableBody items={fieldList} emptyContent="조회된 필드가 없습니다.">
					{field => (
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
		<Section top={<SectionHeader title="필드 목록" />}>
			{content}
		</Section>
	);
}

/**
 * Subject 상세 페이지 - 클라이언트 컴포넌트
 */
function SubjectDetailPageClient({ subjectId }: SubjectDetailPageClientProps) {
	// Subject 상세 조회 (useGetSubjectById는 string 파라미터 받음)
	const { data: response, isLoading } = useGetSubjectById(subjectId);
	const subject = response?.data;

	if (isLoading) {
		return (
			<Page
				top={<PageHeader title="Subject 상세" description="로딩 중..." />}
			>
				<Section>
					<div className="flex items-center justify-center p-8">
						<Spinner size="lg" />
					</div>
				</Section>
			</Page>
		);
	}

	if (!subject) {
		const pageHeader = (
			<PageHeader
				title="Subject 상세"
				description="Subject를 찾을 수 없습니다."
			/>
		);

		return (
			<Page top={pageHeader}>
				<div className="flex flex-col items-center justify-center gap-4 p-8">
					<p className="text-default-500">Subject를 찾을 수 없습니다.</p>
					<Button
						as={Link}
						href={"/subjects" as Route}
						variant="flat"
						startContent={<ArrowLeft className="size-4" />}
					>
						목록으로
					</Button>
				</div>
			</Page>
		);
	}

	const pageHeader = (
		<PageHeader
			title="Subject 상세"
			description="Subject의 상세 정보를 조회합니다."
			actions={
				<Button
					as={Link}
					href={"/subjects" as Route}
					variant="flat"
					startContent={<ArrowLeft className="size-4" />}
				>
					목록으로
				</Button>
			}
		/>
	);

	return (
		<Page top={pageHeader}>
			<VStack gap={4}>
				<SubjectInfoSection subject={subject} />
				<SubjectFieldsSection subjectId={subjectId} group={subject.group} />
			</VStack>
		</Page>
	);
}

export default observer(SubjectDetailPageClient);

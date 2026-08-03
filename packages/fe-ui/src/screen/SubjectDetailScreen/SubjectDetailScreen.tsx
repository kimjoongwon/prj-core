"use client";

import {
	BooleanCell,
	DateTimeCell,
	DefaultCell,
	Screen,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { Spinner, Table } from "@heroui/react";
import { ArrowLeft, Box } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { Chip } from "../../data-display/Chip/Chip";
import { Button } from "../../input/Button/Button";
export interface SubjectDetailScreenSubject {
	name: string;
	displayName?: string | null;
	icon?: string | null;
	group?: string | null;
	order: number;
	createdAt: string | Date | null;
	updatedAt?: string | Date | null;
}
export interface SubjectDetailScreenField {
	name: string;
	displayName?: string | null;
	type: string;
	isRequired: boolean;
	isRelation: boolean;
}
export interface SubjectDetailScreenProps {
	subject?: SubjectDetailScreenSubject;
	subjectFields: SubjectDetailScreenField[];
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
	subject: SubjectDetailScreenSubject;
}) {
	return (
		<SectionSurface>
			<Section>
				<Section.Header title="기본 정보" />
				<Section.Body>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<div className="mb-1 text-sm text-muted">식별자</div>
							<div className="font-medium">{subject.name}</div>
						</div>
						<div>
							<div className="mb-1 text-sm text-muted">표시명</div>
							<div className="font-medium">
								<DefaultCell value={subject.displayName || "-"} />
							</div>
						</div>
						<div>
							<div className="mb-1 text-sm text-muted">아이콘</div>
							<div className="font-medium">
								<DefaultCell value={subject.icon || "-"} />
							</div>
						</div>
						<div>
							<div className="mb-1 text-sm text-muted">분류</div>
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
							<div className="mb-1 text-sm text-muted">정렬 순서</div>
							<div className="font-medium">{subject.order}</div>
						</div>
						<div>
							<div className="mb-1 text-sm text-muted">생성일</div>
							<div className="font-medium">
								<DateTimeCell value={subject.createdAt} />
							</div>
						</div>
						<div>
							<div className="mb-1 text-sm text-muted">수정일</div>
							<div className="font-medium">
								<DateTimeCell value={subject.updatedAt || "-"} />
							</div>
						</div>
					</div>
				</Section.Body>
			</Section>
		</SectionSurface>
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
	subjectFields: SubjectDetailScreenField[];
	isLoading: boolean;
}) {
	let content: ReactNode;

	// entity 그룹이 아닌 경우
	if (group !== "entity") {
		content = (
			<div className="rounded-xl bg-default p-8 text-center">
				<Box className="mx-auto mb-4 size-12 text-muted" />
				<p className="text-muted">
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
				<Table.Content>
					<Table.Header>
						<Table.Column>필드명</Table.Column>
						<Table.Column>표시명</Table.Column>
						<Table.Column>타입</Table.Column>
						<Table.Column className="text-center">필수</Table.Column>
						<Table.Column className="text-center">관계</Table.Column>
					</Table.Header>
					<Table.Body items={subjectFields}>
						{(field) => (
							<Table.Row key={field.name}>
								<Table.Cell>{field.name}</Table.Cell>
								<Table.Cell>
									<DefaultCell value={field.displayName || "-"} />
								</Table.Cell>
								<Table.Cell>
									<code className="text-xs">{field.type}</code>
								</Table.Cell>
								<Table.Cell>
									<div className="flex justify-center">
										<BooleanCell value={field.isRequired} />
									</div>
								</Table.Cell>
								<Table.Cell>
									<div className="flex justify-center">
										<BooleanCell value={field.isRelation} />
									</div>
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table.Content>
			</Table>
		);
	}
	return (
		<SectionSurface>
			<Section>
				<Section.Header title="필드 목록" />
				<Section.Body>{content}</Section.Body>
			</Section>
		</SectionSurface>
	);
}
export const SubjectDetailScreen = observer(
	({
		subject,
		subjectFields,
		isLoading,
		isFieldsLoading,
		onClickBackButton,
	}: SubjectDetailScreenProps) => {
		if (isLoading) {
			return (
				<VStack fullWidth>
					<Screen.Header title="Subject 상세" description="로딩 중..." />
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex items-center justify-center p-8">
									<Spinner size="lg" />
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		if (!subject) {
			const pageHeader = (
				<Screen.Header
					title="Subject 상세"
					description="Subject를 찾을 수 없습니다."
				/>
			);
			return (
				<VStack fullWidth>
					{pageHeader}
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex flex-col items-center justify-center gap-4 p-8">
									<p className="text-muted">Subject를 찾을 수 없습니다.</p>
									<Button
										variant="flat"
										startContent={<ArrowLeft className="size-4" />}
										onPress={onClickBackButton}
									>
										목록으로
									</Button>
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		const pageHeader = (
			<Screen.Header
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
			<VStack fullWidth>
				{pageHeader}
				<SectionSurface>
					<Section>
						<Section.Body>
							<VStack>
								<SubjectInfoSection subject={subject} />
								<SubjectFieldsSection
									group={subject.group}
									subjectFields={subjectFields}
									isLoading={isFieldsLoading}
								/>
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);

"use client";

import type { RoutineDto } from "@cocrepo/api/core/routines";
import type { ProgramDto } from "@cocrepo/api/core/timelines";
import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { Chip } from "../../data-display/Chip/Chip";
import { Typography } from "../../data-display/Typography";
import { DateTimeCell } from "../../data-grid/cell";
import {
	type RoutineActivityFormItem,
	RoutineForm,
	type RoutineFormState,
	type RoutineTaskCandidate,
} from "../../form/RoutineForm";
import { Button } from "../../input/Button/Button";
import { Section } from "../../layout";
import { Screen } from "../../layout/Screen";
import { HStack, VStack } from "../../rhythm";
import { SectionSurface } from "../../surface";

export type {
	RoutineActivityFormItem,
	RoutineFormField,
	RoutineFormState,
	RoutineTaskCandidate,
} from "../../form/RoutineForm";
export type RoutineEditScreenProgram = Pick<ProgramDto, "id" | "name">;
export type RoutineEditScreenMetadata = Pick<
	RoutineDto,
	"createdAt" | "updatedAt"
>;
export interface RoutineEditScreenProps {
	title: ReactNode;
	description?: ReactNode;
	state?: RoutineFormState;
	contentLanguageCode?: string | null;
	candidateTasks?: RoutineTaskCandidate[];
	activities?: RoutineActivityFormItem[];
	programs?: RoutineEditScreenProgram[];
	metadata?: RoutineEditScreenMetadata;
	readOnly?: boolean;
	isLoading?: boolean;
	notFound?: boolean;
	loadingMessage?: ReactNode;
	notFoundMessage?: ReactNode;
	notFoundAction?: ReactNode;
	isTasksLoading?: boolean;
	actions?: ReactNode;
}

/**
 * Routine create/detail/edit route가 공유하는 screen입니다.
 * route가 title, actions, readOnly을 결정합니다.
 */
export const RoutineEditScreen = observer((props: RoutineEditScreenProps) => {
	const {
		title,
		description,
		state,
		contentLanguageCode,
		candidateTasks = [],
		activities,
		programs = [],
		metadata,
		readOnly = false,
		isLoading = false,
		notFound = false,
		loadingMessage = "로딩 중...",
		notFoundMessage = "루틴을 찾을 수 없습니다.",
		notFoundAction,
		isTasksLoading = false,
		actions,
	} = props;
	if (isLoading) {
		return (
			<VStack fullWidth>
				<Screen.Header title={title} description={loadingMessage} />
				<SectionSurface>
					<Section>
						<Section.Body>
							<HStack
								alignItems="center"
								justifyContent="center"
								className="p-8"
							>
								<Spinner size="sm" />
								<Typography color="muted">{loadingMessage}</Typography>
							</HStack>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	}
	if (notFound || !state) {
		return (
			<VStack fullWidth>
				<Screen.Header title={title} description={notFoundMessage} />
				<SectionSurface>
					<Section>
						<Section.Body>
							<VStack
								gap="section"
								alignItems="center"
								justifyContent="center"
								className="p-8"
							>
								<Typography.Paragraph color="muted">
									{notFoundMessage}
								</Typography.Paragraph>
								{notFoundAction ?? <Button variant="tertiary">목록으로</Button>}
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	}
	const visibleActivities = activities ?? state.activities;
	const resolvedActivities = visibleActivities.filter((activity) =>
		Boolean(activity.exerciseName),
	).length;
	const unresolvedActivities = visibleActivities.length - resolvedActivities;
	return (
		<VStack fullWidth>
			<Screen.Header
				title={title}
				description={description}
				actions={actions}
			/>
			<SectionSurface>
				<Section>
					<Section.Body>
						<VStack>
							<RoutineForm
								state={state}
								contentLanguageCode={contentLanguageCode}
								candidateTasks={candidateTasks}
								activities={activities}
								isTasksLoading={isTasksLoading}
								readOnly={readOnly}
							/>
							{readOnly ? (
								<Section>
									<Section.Header title="연결 요약" />
									<Section.Body>
										<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
											<div className="rounded-lg bg-surface-secondary p-3">
												<Typography.Paragraph size="xs" color="muted">
													전체 활동
												</Typography.Paragraph>
												<Typography.Heading level={5} className="mt-1">
													{visibleActivities.length}개
												</Typography.Heading>
											</div>
											<div className="rounded-lg bg-surface-secondary p-3">
												<Typography.Paragraph size="xs" color="muted">
													연결 정상
												</Typography.Paragraph>
												<Typography.Heading
													level={5}
													className="mt-1 text-success"
												>
													{resolvedActivities}개
												</Typography.Heading>
											</div>
											<div className="rounded-lg bg-surface-secondary p-3">
												<Typography.Paragraph size="xs" color="muted">
													사용 중 프로그램
												</Typography.Paragraph>
												<Typography.Heading level={5} className="mt-1">
													{programs.length}개
												</Typography.Heading>
											</div>
										</div>
										{unresolvedActivities > 0 ? (
											<div className="mt-3">
												<Chip size="sm" variant="soft" color="warning">
													확인 필요 {unresolvedActivities}개
												</Chip>
											</div>
										) : null}
									</Section.Body>
								</Section>
							) : null}
							{readOnly && programs.length > 0 ? (
								<Section>
									<Section.Header title="사용 중인 프로그램" />
									<Section.Body>
										<VStack gap="block">
											{programs.map((program) => (
												<div
													key={program.id}
													className="flex items-center justify-between rounded-lg bg-surface-secondary p-3"
												>
													<Typography.Paragraph weight="medium">
														{program.name}
													</Typography.Paragraph>
												</div>
											))}
										</VStack>
									</Section.Body>
								</Section>
							) : null}
							{metadata?.createdAt || metadata?.updatedAt ? (
								<Section>
									<Section.Header title="관리 정보" />
									<Section.Body>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											{metadata.createdAt ? (
												<div>
													<label>
														<Typography type="body-sm" color="muted">
															등록일
														</Typography>
													</label>
													<div className="mt-1">
														<DateTimeCell value={metadata.createdAt} />
													</div>
												</div>
											) : null}
											{metadata.updatedAt ? (
												<div>
													<label>
														<Typography type="body-sm" color="muted">
															수정일
														</Typography>
													</label>
													<div className="mt-1">
														<DateTimeCell value={metadata.updatedAt} />
													</div>
												</div>
											) : null}
										</div>
									</Section.Body>
								</Section>
							) : null}
						</VStack>
					</Section.Body>
				</Section>
			</SectionSurface>
		</VStack>
	);
});

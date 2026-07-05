"use client";

import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { Chip } from "../../data-display/Chip/Chip";
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
import { VStack } from "../../rhythm";
import { SectionSurface } from "../../surface";

export type {
	RoutineActivityFormItem,
	RoutineFormField,
	RoutineFormState,
	RoutineTaskCandidate,
} from "../../form/RoutineForm";
export interface RoutineEditScreenProgram {
	id: string;
	name: string;
}
export interface RoutineEditScreenMetadata {
	createdAt?: string | null;
	updatedAt?: string | null;
}
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
							<div className="flex items-center justify-center gap-2 p-8">
								<Spinner size="sm" />
								<span className="text-muted">{loadingMessage}</span>
							</div>
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
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-muted">{notFoundMessage}</p>
								{notFoundAction ?? <Button variant="flat">목록으로</Button>}
							</div>
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
												<p className="text-xs text-muted">전체 활동</p>
												<p className="mt-1 text-lg font-semibold">
													{visibleActivities.length}개
												</p>
											</div>
											<div className="rounded-lg bg-surface-secondary p-3">
												<p className="text-xs text-muted">연결 정상</p>
												<p className="mt-1 text-lg font-semibold text-success">
													{resolvedActivities}개
												</p>
											</div>
											<div className="rounded-lg bg-surface-secondary p-3">
												<p className="text-xs text-muted">사용 중 프로그램</p>
												<p className="mt-1 text-lg font-semibold">
													{programs.length}개
												</p>
											</div>
										</div>
										{unresolvedActivities > 0 ? (
											<div className="mt-3">
												<Chip size="sm" variant="flat" color="warning">
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
										<div className="flex flex-col gap-2">
											{programs.map((program) => (
												<div
													key={program.id}
													className="flex items-center justify-between rounded-lg bg-surface-secondary p-3"
												>
													<p className="font-medium">{program.name}</p>
												</div>
											))}
										</div>
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
													<label className="text-sm text-muted">등록일</label>
													<div className="mt-1">
														<DateTimeCell value={metadata.createdAt} />
													</div>
												</div>
											) : null}
											{metadata.updatedAt ? (
												<div>
													<label className="text-sm text-muted">수정일</label>
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

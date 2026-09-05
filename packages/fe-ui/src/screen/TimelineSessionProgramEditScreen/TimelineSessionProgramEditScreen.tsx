"use client";

import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { DateTimeCell } from "../../data-grid/cell";
import {
	TimelineSessionProgramForm,
	type TimelineSessionProgramFormState,
	type TimelineSessionProgramRoutinePreviewItem,
} from "../../form/TimelineSessionProgramForm";
import { Button } from "../../input/Button/Button";
import { Section } from "../../layout";
import { Screen } from "../../layout/Screen";
import { VStack } from "../../rhythm";
import { SectionSurface } from "../../surface";

export type {
	TimelineSessionProgramFormField,
	TimelineSessionProgramFormState,
	TimelineSessionProgramRoutinePreviewItem,
} from "../../form/TimelineSessionProgramForm";
export interface TimelineSessionProgramEditScreenMetadata {
	routineHref?: Route;
	instructorLabel?: string | null;
	activityCountLabel?: string;
	sessionName?: string | null;
	sessionHref?: Route;
	createdAt?: Date | null;
}
export interface TimelineSessionProgramEditScreenProps {
	title: ReactNode;
	description?: ReactNode;
	state?: TimelineSessionProgramFormState;
	contentLanguageCode?: string | null;
	routinePreview?: TimelineSessionProgramRoutinePreviewItem[];
	hasUnschedulableRoutine?: boolean;
	readOnly?: boolean;
	isLoading?: boolean;
	notFound?: boolean;
	loadingMessage?: ReactNode;
	notFoundMessage?: ReactNode;
	notFoundAction?: ReactNode;
	actions?: ReactNode;
	metadata?: TimelineSessionProgramEditScreenMetadata;
}

/**
 * Timeline Session Program create/detail/edit route가 공유하는 screen입니다.
 * route가 title, actions, readOnly을 결정합니다.
 */
export const TimelineSessionProgramEditScreen = observer(
	(props: TimelineSessionProgramEditScreenProps) => {
		const {
			title,
			description,
			state,
			contentLanguageCode,
			routinePreview = [],
			hasUnschedulableRoutine = false,
			readOnly = false,
			isLoading = false,
			notFound = false,
			loadingMessage = "로딩 중...",
			notFoundMessage = "프로그램을 찾을 수 없습니다.",
			notFoundAction,
			actions,
			metadata,
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
									{notFoundAction ?? <Button variant="tertiary">목록으로</Button>}
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
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
								<TimelineSessionProgramForm
									state={state}
									contentLanguageCode={contentLanguageCode}
									routinePreview={routinePreview}
									hasUnschedulableRoutine={hasUnschedulableRoutine}
									readOnly={readOnly}
								/>
								{metadata ? (
									<Section>
										<Section.Header title="관리 정보" />
										<Section.Body>
											<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
												<div>
													<label className="text-sm text-muted">루틴</label>
													<div className="mt-1">
														{metadata.routineHref && state.routineName ? (
															<Link
																href={metadata.routineHref}
																className="text-accent hover:underline"
															>
																{state.routineName}
															</Link>
														) : (
															state.routineName || "-"
														)}
													</div>
												</div>
												<div>
													<label className="text-sm text-muted">강사</label>
													<p className="mt-1">
														{metadata.instructorLabel ?? state.instructorName}
													</p>
												</div>
												<div>
													<label className="text-sm text-muted">운동 수</label>
													<p className="mt-1">
														{metadata.activityCountLabel ??
															`${routinePreview.length}개`}
													</p>
												</div>
												<div>
													<label className="text-sm text-muted">세션</label>
													<div className="mt-1">
														{metadata.sessionHref && metadata.sessionName ? (
															<Link
																href={metadata.sessionHref}
																className="text-accent hover:underline"
															>
																{metadata.sessionName}
															</Link>
														) : (
															(metadata.sessionName ?? "-")
														)}
													</div>
												</div>
												{metadata.createdAt ? (
													<div>
														<label className="text-sm text-muted">등록일</label>
														<div className="mt-1">
															<DateTimeCell value={metadata.createdAt} />
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
	},
);

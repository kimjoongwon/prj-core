"use client";

import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Typography } from "../../data-display/Typography";
import { DateTimeCell } from "../../data-grid/cell";
import {
	TimelineSessionProgramForm,
	type TimelineSessionProgramFormState,
	type TimelineSessionProgramRoutinePreviewItem,
} from "../../form/TimelineSessionProgramForm";
import { Button } from "../../input/Button/Button";
import { Section } from "../../layout";
import { Screen } from "../../layout/Screen";
import { HStack, VStack } from "../../rhythm";
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
									{notFoundAction ?? (
										<Button variant="tertiary">목록으로</Button>
									)}
								</VStack>
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
													<label>
														<Typography type="body-sm" color="muted">
															루틴
														</Typography>
													</label>
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
													<label>
														<Typography type="body-sm" color="muted">
															강사
														</Typography>
													</label>
													<Typography.Paragraph className="mt-1">
														{metadata.instructorLabel ?? state.instructorName}
													</Typography.Paragraph>
												</div>
												<div>
													<label>
														<Typography type="body-sm" color="muted">
															운동 수
														</Typography>
													</label>
													<Typography.Paragraph className="mt-1">
														{metadata.activityCountLabel ??
															`${routinePreview.length}개`}
													</Typography.Paragraph>
												</div>
												<div>
													<label>
														<Typography type="body-sm" color="muted">
															세션
														</Typography>
													</label>
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

"use client";

import type { ProgramDto, SessionDto } from "@cocrepo/api/core/timelines";
import { Table } from "@heroui/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { Chip } from "../../data-display/Chip/Chip";
import { DateTimeCell } from "../../data-grid/cell";
import {
	TimelineSessionForm,
	type TimelineSessionFormCycleType,
	type TimelineSessionFormDayOfWeek,
	type TimelineSessionFormSessionType,
	type TimelineSessionFormState,
} from "../../form/TimelineSessionForm";
import { Button } from "../../input/Button/Button";
import { Section } from "../../layout";
import { Screen } from "../../layout/Screen";
import { VStack } from "../../rhythm";
import { SectionSurface } from "../../surface";

export type {
	TimelineSessionFormCycleType,
	TimelineSessionFormDayOfWeek,
	TimelineSessionFormField,
	TimelineSessionFormSessionType,
	TimelineSessionFormState,
} from "../../form/TimelineSessionForm";
export type TimelineSessionScreenSessionType = TimelineSessionFormSessionType;
export type TimelineSessionScreenCycleType = TimelineSessionFormCycleType;
export type TimelineSessionScreenDayOfWeek = TimelineSessionFormDayOfWeek;
export type TimelineSessionEditScreenMetadata = Pick<
	SessionDto,
	"createdAt"
> & {
	typeLabel?: string;
	typeColor?: "primary" | "secondary" | "success";
	recurringDayLabel?: string;
	repeatCycleLabel?: string;
	timelineName?: string | null;
	timelineHref?: Route;
};
export type TimelineSessionProgramRow = Pick<ProgramDto, "id" | "name"> & {
	href: Route;
	routineName: string;
	activityCountLabel: string;
	previewText: string;
	instructorName: string;
	isConnectionResolved: boolean;
	capacityLabel: string;
	levelLabel: string;
};
export interface TimelineSessionEditScreenProps {
	title: ReactNode;
	description?: ReactNode;
	state?: TimelineSessionFormState;
	contentLanguageCode?: string | null;
	readOnly?: boolean;
	isLoading?: boolean;
	notFound?: boolean;
	loadingMessage?: ReactNode;
	notFoundMessage?: ReactNode;
	notFoundAction?: ReactNode;
	actions?: ReactNode;
	metadata?: TimelineSessionEditScreenMetadata;
	programs?: TimelineSessionProgramRow[];
	totalPrograms?: number;
	resolvedPrograms?: number;
	unresolvedPrograms?: number;
	onClickCreateProgramButton?: () => void;
	onClickEditProgramButton?: (programId: bigint) => void;
	onClickDeleteProgramButton?: (programId: bigint) => void;
}

/**
 * Timeline Session create/detail/edit route가 공유하는 screen입니다.
 * route가 title, actions, readOnly을 결정합니다.
 */
export const TimelineSessionEditScreen = observer(
	(props: TimelineSessionEditScreenProps) => {
		const {
			title,
			description,
			state,
			contentLanguageCode,
			readOnly = false,
			isLoading = false,
			notFound = false,
			loadingMessage = "로딩 중...",
			notFoundMessage = "세션을 찾을 수 없습니다.",
			notFoundAction,
			actions,
			metadata,
			programs,
			totalPrograms = programs?.length ?? 0,
			resolvedPrograms = 0,
			unresolvedPrograms = 0,
			onClickCreateProgramButton,
			onClickEditProgramButton,
			onClickDeleteProgramButton,
		} = props;
		if (isLoading) {
			return (
				<VStack fullWidth>
					<Screen.Header title={title} description={loadingMessage} />
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex items-center justify-center gap-2 p-8">
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
								<TimelineSessionForm
									state={state}
									contentLanguageCode={contentLanguageCode}
									readOnly={readOnly}
								/>
								{metadata ? (
									<Section>
										<Section.Header title="관리 정보" />
										<Section.Body>
											<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
												{metadata.typeLabel && metadata.typeColor ? (
													<div>
														<label className="text-sm text-muted">유형</label>
														<div className="mt-1">
															<Chip
																color={metadata.typeColor}
																variant="flat"
																size="sm"
															>
																{metadata.typeLabel}
															</Chip>
														</div>
													</div>
												) : null}
												{state.type === "RECURRING" ? (
													<>
														<div>
															<label className="text-sm text-muted">
																반복 요일
															</label>
															<p className="mt-1">
																{metadata.recurringDayLabel ?? "-"}
															</p>
														</div>
														<div>
															<label className="text-sm text-muted">
																반복 주기
															</label>
															<p className="mt-1">
																{metadata.repeatCycleLabel ?? "-"}
															</p>
														</div>
													</>
												) : null}
												<div>
													<label className="text-sm text-muted">타임라인</label>
													<div className="mt-1">
														{metadata.timelineHref && metadata.timelineName ? (
															<Link
																href={metadata.timelineHref}
																className="text-accent hover:underline"
															>
																{metadata.timelineName}
															</Link>
														) : (
															(metadata.timelineName ?? "-")
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
								{programs ? (
									<Section>
										<Section.Header
											title="프로그램 연결 허브"
											actions={
												onClickCreateProgramButton ? (
													<Button
														variant="primary"
														size="sm"
														startContent={<Plus className="h-4 w-4" />}
														onPress={onClickCreateProgramButton}
													>
														프로그램 등록
													</Button>
												) : undefined
											}
										/>
										<Section.Body>
											<div className="grid grid-cols-1 gap-2 px-4 py-3 md:grid-cols-3">
												<div className="rounded-lg bg-surface-secondary p-3">
													<p className="text-xs text-muted">전체 프로그램</p>
													<p className="mt-1 text-lg font-semibold">
														{totalPrograms}개
													</p>
												</div>
												<div className="rounded-lg bg-surface-secondary p-3">
													<p className="text-xs text-muted">강사 연결 정상</p>
													<p className="mt-1 text-lg font-semibold text-success">
														{resolvedPrograms}개
													</p>
												</div>
												<div className="rounded-lg bg-surface-secondary p-3">
													<p className="text-xs text-muted">확인 필요</p>
													<p className="mt-1 text-lg font-semibold text-warning">
														{unresolvedPrograms}개
													</p>
												</div>
											</div>
											<Table aria-label="프로그램 목록">
												<Table.Content>
													<Table.Header>
														<Table.Column>프로그램명</Table.Column>
														<Table.Column>루틴명</Table.Column>
														<Table.Column className="text-center">
															운동 수
														</Table.Column>
														<Table.Column>대표 운동</Table.Column>
														<Table.Column>강사</Table.Column>
														<Table.Column className="text-center">
															연결 상태
														</Table.Column>
														<Table.Column className="text-center">
															정원
														</Table.Column>
														<Table.Column>난이도</Table.Column>
														<Table.Column className="text-center">
															액션
														</Table.Column>
													</Table.Header>
													<Table.Body items={programs}>
														{(program) => (
															<Table.Row key={program.id}>
																<Table.Cell>
																	<Link
																		href={program.href}
																		className="text-left text-accent hover:underline"
																		onClick={(
																			event: MouseEvent<HTMLAnchorElement>,
																		) => {
																			event.stopPropagation();
																		}}
																	>
																		{program.name}
																	</Link>
																</Table.Cell>
																<Table.Cell>{program.routineName}</Table.Cell>
																<Table.Cell>
																	{program.activityCountLabel}
																</Table.Cell>
																<Table.Cell>{program.previewText}</Table.Cell>
																<Table.Cell>
																	{program.instructorName}
																</Table.Cell>
																<Table.Cell>
																	{program.isConnectionResolved ? (
																		<Chip
																			color="success"
																			variant="flat"
																			size="sm"
																		>
																			정상
																		</Chip>
																	) : (
																		<Chip
																			color="warning"
																			variant="flat"
																			size="sm"
																		>
																			확인필요
																		</Chip>
																	)}
																</Table.Cell>
																<Table.Cell>{program.capacityLabel}</Table.Cell>
																<Table.Cell>{program.levelLabel}</Table.Cell>
																<Table.Cell>
																	<div className="flex justify-center gap-1">
																		{onClickEditProgramButton ? (
																			<Button
																				size="sm"
																				variant="ghost"
																				isIconOnly
																				onPress={() =>
																					onClickEditProgramButton(program.id)
																				}
																			>
																				<Pencil className="h-4 w-4" />
																			</Button>
																		) : null}
																		{onClickDeleteProgramButton ? (
																			<Button
																				size="sm"


																				variant="ghost"
																				isIconOnly
																				onPress={() =>
																					onClickDeleteProgramButton(program.id)
																				}
																			>
																				<Trash2 className="h-4 w-4" />
																			</Button>
																		) : null}
																	</div>
																</Table.Cell>
															</Table.Row>
														)}
													</Table.Body>
												</Table.Content>
											</Table>
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

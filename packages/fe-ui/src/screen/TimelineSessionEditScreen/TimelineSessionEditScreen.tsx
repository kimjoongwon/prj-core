"use client";

import type { ProgramDto, SessionDto } from "@cocrepo/api/core/timelines";
import { Table } from "@heroui/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { Chip } from "../../data-display/Chip/Chip";
import { Typography } from "../../data-display/Typography";
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
import { HStack, VStack } from "../../rhythm";
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
	typeColor?: "accent" | "default" | "success";
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
								<HStack
									alignItems="center"
									justifyContent="center"
									className="p-8"
								>
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
														<label>
															<Typography type="body-sm" color="muted">
																유형
															</Typography>
														</label>
														<div className="mt-1">
															<Chip
																color={metadata.typeColor}
																variant="soft"
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
															<label>
																<Typography type="body-sm" color="muted">
																	반복 요일
																</Typography>
															</label>
															<Typography.Paragraph className="mt-1">
																{metadata.recurringDayLabel ?? "-"}
															</Typography.Paragraph>
														</div>
														<div>
															<label>
																<Typography type="body-sm" color="muted">
																	반복 주기
																</Typography>
															</label>
															<Typography.Paragraph className="mt-1">
																{metadata.repeatCycleLabel ?? "-"}
															</Typography.Paragraph>
														</div>
													</>
												) : null}
												<div>
													<label>
														<Typography type="body-sm" color="muted">
															타임라인
														</Typography>
													</label>
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
													<Typography.Paragraph size="xs" color="muted">
														전체 프로그램
													</Typography.Paragraph>
													<Typography.Heading level={5} className="mt-1">
														{totalPrograms}개
													</Typography.Heading>
												</div>
												<div className="rounded-lg bg-surface-secondary p-3">
													<Typography.Paragraph size="xs" color="muted">
														강사 연결 정상
													</Typography.Paragraph>
													<Typography.Heading
														level={5}
														className="mt-1 text-success"
													>
														{resolvedPrograms}개
													</Typography.Heading>
												</div>
												<div className="rounded-lg bg-surface-secondary p-3">
													<Typography.Paragraph size="xs" color="muted">
														확인 필요
													</Typography.Paragraph>
													<Typography.Heading
														level={5}
														className="mt-1 text-warning"
													>
														{unresolvedPrograms}개
													</Typography.Heading>
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
																			variant="soft"
																			size="sm"
																		>
																			정상
																		</Chip>
																	) : (
																		<Chip
																			color="warning"
																			variant="soft"
																			size="sm"
																		>
																			확인필요
																		</Chip>
																	)}
																</Table.Cell>
																<Table.Cell>{program.capacityLabel}</Table.Cell>
																<Table.Cell>{program.levelLabel}</Table.Cell>
																<Table.Cell>
																	<HStack justifyContent="center" gap="dense">
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
																	</HStack>
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

"use client";

import { Table } from "@heroui/react";
import { Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { DateTimeCell } from "../../data-grid/cell";
import { Chip } from "../../data-display/Chip/Chip";
import {
	TimelineForm,
	type TimelineFormState,
} from "../../form/TimelineForm";
import { Button } from "../../input/Button/Button";
import { Section } from "../../layout";
import { VStack } from "../../rhythm";
import { SectionSurface } from "../../surface";
import { PageTitleBar } from "../../widget/PageTitleBar";

export type {
	TimelineFormField,
	TimelineFormState,
} from "../../form/TimelineForm";

export interface TimelineEditScreenMetadata {
	createdAt?: string | null;
}

export interface TimelineEditScreenSessionRow {
	id: string;
	name: string;
	typeLabel: string;
	typeColor: "primary" | "secondary" | "success";
	programCount: number;
	isConnected: boolean;
	startDateTime?: string | null;
	recurringDayLabel: string;
	repeatCycleLabel: string;
	createdAt: string;
}

export interface TimelineEditScreenProps {
	title: ReactNode;
	description?: ReactNode;
	state?: TimelineFormState;
	contentLanguageCode?: string | null;
	readOnly?: boolean;
	isLoading?: boolean;
	notFound?: boolean;
	loadingMessage?: ReactNode;
	notFoundMessage?: ReactNode;
	notFoundAction?: ReactNode;
	actions?: ReactNode;
	metadata?: TimelineEditScreenMetadata;
	sessions?: TimelineEditScreenSessionRow[];
	totalSessions?: number;
	connectedSessions?: number;
	unconnectedSessions?: number;
	onClickCreateSessionButton?: () => void;
	onClickSessionNameButton?: (sessionId: string) => void;
	onClickCreateProgramButton?: (sessionId: string) => void;
	onClickDeleteSessionButton?: (sessionId: string) => void;
}

/**
 * Timeline create/detail/edit route가 공유하는 screen입니다.
 * route가 title, actions, readOnly을 결정합니다.
 */
export const TimelineEditScreen = observer((props: TimelineEditScreenProps) => {
	const {
		title,
		description,
		state,
		contentLanguageCode,
		readOnly = false,
		isLoading = false,
		notFound = false,
		loadingMessage = "로딩 중...",
		notFoundMessage = "타임라인을 찾을 수 없습니다.",
		notFoundAction,
		actions,
		metadata,
		sessions,
		totalSessions = sessions?.length ?? 0,
		connectedSessions = 0,
		unconnectedSessions = 0,
		onClickCreateSessionButton,
		onClickSessionNameButton,
		onClickCreateProgramButton,
		onClickDeleteSessionButton,
	} = props;

	if (isLoading) {
		return (
			<VStack fullWidth>
				<PageTitleBar title={title} description={loadingMessage} />
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
				<PageTitleBar title={title} description={notFoundMessage} />
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

	return (
		<VStack fullWidth>
			<PageTitleBar title={title} description={description} actions={actions} />
			<SectionSurface>
				<Section>
					<Section.Body>
						<VStack>
							<Section>
								<Section.Header>
									<PageTitleBar level={2} title="기본 정보" />
								</Section.Header>
								<Section.Body>
									<TimelineForm
										state={state}
										contentLanguageCode={contentLanguageCode}
										readOnly={readOnly}
									/>
								</Section.Body>
							</Section>
							{metadata?.createdAt ? (
								<Section>
									<Section.Header>
										<PageTitleBar level={2} title="관리 정보" />
									</Section.Header>
									<Section.Body>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div>
												<label className="text-sm text-muted">등록일</label>
												<div className="mt-1">
													<DateTimeCell value={metadata.createdAt} />
												</div>
											</div>
										</div>
									</Section.Body>
								</Section>
							) : null}
							{sessions ? (
								<Section>
									<Section.Header>
										<PageTitleBar
											level={2}
											title="세션 목록"
											actions={
												onClickCreateSessionButton ? (
													<Button
														color="primary"
														size="sm"
														startContent={<Plus className="h-4 w-4" />}
														onPress={onClickCreateSessionButton}
													>
														세션 등록
													</Button>
												) : undefined
											}
										/>
									</Section.Header>
									<Section.Body>
										<div className="grid grid-cols-1 gap-2 px-4 py-3 md:grid-cols-3">
											<div className="rounded-lg bg-surface-secondary p-3">
												<p className="text-xs text-muted">전체 세션</p>
												<p className="mt-1 text-lg font-semibold">
													{totalSessions}개
												</p>
											</div>
											<div className="rounded-lg bg-surface-secondary p-3">
												<p className="text-xs text-muted">연결된 세션</p>
												<p className="mt-1 text-lg font-semibold text-success">
													{connectedSessions}개
												</p>
											</div>
											<div className="rounded-lg bg-surface-secondary p-3">
												<p className="text-xs text-muted">미연결 세션</p>
												<p className="mt-1 text-lg font-semibold text-warning">
													{unconnectedSessions}개
												</p>
											</div>
										</div>
										<Table aria-label="세션 목록">
											<Table.Content>
												<Table.Header>
													<Table.Column>세션명</Table.Column>
													<Table.Column className="text-center">
														유형
													</Table.Column>
													<Table.Column className="text-center">
														프로그램
													</Table.Column>
													<Table.Column className="text-center">
														연결 상태
													</Table.Column>
													<Table.Column>시작 일시</Table.Column>
													<Table.Column className="text-center">
														반복 요일
													</Table.Column>
													<Table.Column className="text-center">
														반복 주기
													</Table.Column>
													<Table.Column>등록일</Table.Column>
													<Table.Column className="text-center">
														액션
													</Table.Column>
												</Table.Header>
												<Table.Body items={sessions}>
													{(session) => (
														<Table.Row key={session.id}>
															<Table.Cell>
																<button
																	type="button"
																	className="text-left text-accent hover:underline"
																	onClick={() =>
																		onClickSessionNameButton?.(session.id)
																	}
																>
																	{session.name}
																</button>
															</Table.Cell>
															<Table.Cell>
																<Chip
																	color={session.typeColor}
																	variant="flat"
																	size="sm"
																>
																	{session.typeLabel}
																</Chip>
															</Table.Cell>
															<Table.Cell>{session.programCount}개</Table.Cell>
															<Table.Cell>
																{session.isConnected ? (
																	<Chip
																		color="success"
																		variant="flat"
																		size="sm"
																	>
																		연결됨
																	</Chip>
																) : (
																	<Chip
																		color="warning"
																		variant="flat"
																		size="sm"
																	>
																		미연결
																	</Chip>
																)}
															</Table.Cell>
															<Table.Cell>
																{session.startDateTime ? (
																	<DateTimeCell value={session.startDateTime} />
																) : (
																	"-"
																)}
															</Table.Cell>
															<Table.Cell>
																{session.recurringDayLabel}
															</Table.Cell>
															<Table.Cell>
																{session.repeatCycleLabel}
															</Table.Cell>
															<Table.Cell>
																<DateTimeCell value={session.createdAt} />
															</Table.Cell>
															<Table.Cell>
																<div className="flex justify-center gap-1">
																	{onClickCreateProgramButton ? (
																		<Button
																			size="sm"
																			variant="light"
																			onPress={() =>
																				onClickCreateProgramButton(session.id)
																			}
																		>
																			프로그램 등록
																		</Button>
																	) : null}
																	{onClickDeleteSessionButton ? (
																		<Button
																			size="sm"
																			color="danger"
																			variant="light"
																			isIconOnly
																			onPress={() =>
																				onClickDeleteSessionButton(session.id)
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
});

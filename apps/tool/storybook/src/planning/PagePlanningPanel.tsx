import type { ChangeEvent, CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import Markdown from "markdown-to-jsx";
import type {
	OverviewManifest,
	PlanningDocument,
	PlanningDocumentKind,
	PageCatalogEntry,
} from "../overview/manifest";
import {
	findCatalogEntryForStory,
	getPlanningDocument,
} from "../overview/manifest";

type PlanningPanelMode = "summary" | "raw";
type PlanningPanelVariant = "board" | "compact" | "full";
type CodexCapabilityStatus = "error" | "idle" | "loading" | "ready";
type CodexJobStatus =
	| "failed"
	| "published"
	| "publishing"
	| "ready"
	| "running";

interface CodexCapabilities {
	available: boolean;
	codexVersion: string | null;
	editableTargets: string[];
	ghAuthenticated: boolean;
	ghVersion: string | null;
	mode: "local-only";
	originUrl: string | null;
	publishBase: "main";
	reason: string | null;
}

interface CodexCapabilityState {
	data: CodexCapabilities | null;
	message: string | null;
	status: CodexCapabilityStatus;
}

interface CodexJobLogEntry {
	createdAt: string;
	id: string;
	message: string;
	stream: string;
}

interface CodexJobSnapshot {
	branchName: string | null;
	componentName: string;
	createdAt: string;
	id: string;
	instruction: string;
	logs: CodexJobLogEntry[];
	prUrl: string | null;
	status: CodexJobStatus;
	storyId: string;
	storyTitle: string;
	summary: string | null;
	targetFiles: string[];
	touchedFiles: string[];
	warnings: string[];
}

const routeSectionHeadings = [
	"사용자 시나리오",
	"Rendering Decision",
	"API 호출",
	"이벤트 핸들러",
];

const purePageSectionHeadings = ["역할", "공개 계약", "구성 요소", "의존성"];
const CODEX_CAPABILITIES_PATH = "/__codex/capabilities";

function getPlanningDocumentsForEntry(
	manifest: OverviewManifest,
	entry: PageCatalogEntry,
) {
	const purePageDocument = getPlanningDocument(
		manifest,
		entry.planning.purePageId,
	);
	const routeDocuments = entry.planning.routePageIds
		.map((documentId) => getPlanningDocument(manifest, documentId))
		.filter((document): document is PlanningDocument => document !== null);

	return {
		purePageDocument,
		routeDocuments,
	};
}

function getEditablePlanningFiles({
	purePageDocument,
	routeDocuments,
}: {
	purePageDocument: PlanningDocument | null;
	routeDocuments: PlanningDocument[];
}) {
	const targetFiles = [
		...routeDocuments.map((document) => document.sourcePath),
		...(purePageDocument ? [purePageDocument.sourcePath] : []),
	];

	return [...new Set(targetFiles)];
}

function isCodexTerminalStatus(status: CodexJobStatus) {
	return status === "failed" || status === "published" || status === "ready";
}

function isJsonLikeResponse(contentType: string, bodyText: string) {
	const normalizedBody = bodyText.trimStart();
	return (
		contentType.includes("application/json") ||
		normalizedBody.startsWith("{") ||
		normalizedBody.startsWith("[")
	);
}

function isHtmlLikeResponse(contentType: string, bodyText: string) {
	const normalizedBody = bodyText.trimStart().toLowerCase();
	return (
		contentType.includes("text/html") ||
		normalizedBody.startsWith("<!doctype html") ||
		normalizedBody.startsWith("<html")
	);
}

function getCodexBridgeParseErrorMessage({
	bodyText,
	contentType,
	status,
}: {
	bodyText: string;
	contentType: string;
	status: number;
}) {
	if (status === 404) {
		return "Codex bridge endpoint를 찾지 못했습니다. Storybook dev 서버를 재시작하거나 정적 build가 아닌지 확인하세요.";
	}
	if (isHtmlLikeResponse(contentType, bodyText)) {
		return "Codex bridge가 JSON 대신 HTML 응답을 반환했습니다. 로그인 리다이렉트 또는 dev 서버 상태를 확인하세요.";
	}

	return "Codex bridge가 JSON이 아닌 응답을 반환했습니다.";
}

async function readResponseJson<T>(response: Response) {
	const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
	const bodyText = await response.text();
	if (!isJsonLikeResponse(contentType, bodyText)) {
		throw new Error(
			getCodexBridgeParseErrorMessage({
				bodyText,
				contentType,
				status: response.status,
			}),
		);
	}

	let payload: T | null = null;
	try {
		payload = JSON.parse(bodyText) as T | null;
	} catch {
		throw new Error("Codex bridge JSON payload를 해석하지 못했습니다.");
	}
	if (payload === null) {
		throw new Error("Codex bridge JSON payload가 비어 있습니다.");
	}
	if (!response.ok) {
		const responseReason =
			typeof (payload as { reason?: unknown }).reason === "string"
				? String((payload as { reason: string }).reason)
				: null;
		const responseMessage =
			typeof (payload as { message?: unknown }).message === "string"
				? String((payload as { message: string }).message)
				: (responseReason ?? "Codex bridge 요청이 실패했습니다.");
		throw new Error(responseMessage);
	}

	return payload;
}

export function PagePlanningPanelView({
	codexEnabled = true,
	manifest,
	storyId,
	variant = "full",
}: {
	codexEnabled?: boolean;
	manifest: OverviewManifest;
	storyId: string | null;
	variant?: PlanningPanelVariant;
}) {
	const [mode, setMode] = useState<PlanningPanelMode>("summary");
	const isCompact = variant === "compact";
	const isBoard = variant === "board";

	useEffect(() => {
		setMode("summary");
	}, [storyId]);

	if (!storyId) {
		return (
			<div style={panelStyle}>
				<EmptyState
					description="현재 선택된 스토리가 없습니다."
					title="No Story Selected"
				/>
			</div>
		);
	}

	const entry = findCatalogEntryForStory(manifest, storyId);

	if (!entry) {
		return (
			<div style={panelStyle}>
				<EmptyState
					description="page overview manifest에 연결된 page story를 선택하면 우측에서 기획 요약과 raw spec을 함께 볼 수 있습니다."
					title="Planning Not Available"
				/>
			</div>
		);
	}

	const { purePageDocument, routeDocuments } = getPlanningDocumentsForEntry(
		manifest,
		entry,
	);
	const editableTargetFiles = getEditablePlanningFiles({
		purePageDocument,
		routeDocuments,
	});
	const handleSummaryModeClick = () => {
		setMode("summary");
	};
	const handleRawModeClick = () => {
		setMode("raw");
	};

	return (
		<div style={panelStyle}>
			<header style={headerStyle}>
				<p style={eyebrowStyle}>Page Planning</p>
				<h2 style={titleStyle}>{entry.componentName}</h2>
				<p style={descriptionStyle}>
					{entry.bindings.length === 0
						? "Standalone page story입니다. pure screen spec를 중심으로 확인합니다."
						: isCompact
							? `${entry.bindings.length}개의 route context 중 핵심 요약만 빠르게 보여줍니다.`
							: isBoard
								? `${entry.bindings.length}개의 route context를 planning card로 배치했습니다. 필요한 카드만 펼쳐서 확인하세요.`
								: `${entry.bindings.length}개의 route context와 pure screen spec를 함께 보여줍니다.`}
				</p>
				<div style={chipRowStyle}>
					<InfoChip
						label={entry.maturity === "scenario" ? "Scenario" : "Scaffold"}
					/>
					<InfoChip
						label={
							entry.bindings.length === 0
								? "Standalone"
								: `${entry.bindings.length} Route`
						}
					/>
				</div>
				{entry.storyHref ? (
					<a href={entry.storyHref} style={storyLinkStyle} target="_top">
						Open Canonical Story
					</a>
				) : null}
				<CodexEditLauncher
					codexEnabled={codexEnabled}
					componentName={entry.componentName}
					storyId={storyId}
					storyTitle={entry.storyTitle}
					targetFiles={editableTargetFiles}
				/>
			</header>

			{isCompact || isBoard ? null : (
				<div style={toggleRowStyle}>
					<ToggleButton
						isActive={mode === "summary"}
						label="Summary"
						onClick={handleSummaryModeClick}
					/>
					<ToggleButton
						isActive={mode === "raw"}
						label="Raw Spec"
						onClick={handleRawModeClick}
					/>
				</div>
			)}

			{mode === "summary" || isCompact || isBoard ? (
				<div style={sectionStackStyle}>
					{routeDocuments.length > 0 ? (
						<PlanningDocumentGroup
							documents={routeDocuments}
							groupLabel="Route Planning"
							isCompact={isCompact}
							variant={variant}
						/>
					) : null}
					{purePageDocument ? (
						<PlanningDocumentGroup
							documents={[purePageDocument]}
							groupLabel="Pure Screen"
							isCompact={isCompact}
							variant={variant}
						/>
					) : null}
					{routeDocuments.length === 0 && !purePageDocument ? (
						<EmptyState
							description="story와 연결된 spec sidecar를 찾지 못했습니다."
							title="Spec Missing"
						/>
					) : null}
				</div>
			) : (
				<div style={sectionStackStyle}>
					{routeDocuments.map((document) => (
						<RawDocumentCard document={document} key={document.id} />
					))}
					{purePageDocument ? (
						<RawDocumentCard
							document={purePageDocument}
							key={purePageDocument.id}
						/>
					) : null}
					{routeDocuments.length === 0 && !purePageDocument ? (
						<EmptyState
							description="render할 raw markdown spec가 없습니다."
							title="Spec Missing"
						/>
					) : null}
				</div>
			)}
		</div>
	);
}

function PlanningDocumentGroup({
	documents,
	groupLabel,
	isCompact = false,
	variant = "full",
}: {
	documents: PlanningDocument[];
	groupLabel: string;
	isCompact?: boolean;
	variant?: PlanningPanelVariant;
}) {
	const isBoard = variant === "board";
	const visibleDocuments = isCompact ? documents.slice(0, 1) : documents;

	return (
		<section style={groupStyle}>
			<div style={groupHeaderStyle}>
				<p style={groupEyebrowStyle}>{groupLabel}</p>
				<strong style={groupValueStyle}>{documents.length}</strong>
			</div>
			<div style={isBoard ? boardGridStyle : sectionStackStyle}>
				{visibleDocuments.map((document) => (
					<SummaryDocumentCard
						document={document}
						isCompact={isCompact}
						variant={variant}
						key={document.id}
					/>
				))}
			</div>
		</section>
	);
}

function SummaryDocumentCard({
	document,
	isCompact = false,
	variant = "full",
}: {
	document: PlanningDocument;
	isCompact?: boolean;
	variant?: PlanningPanelVariant;
}) {
	const isBoard = variant === "board";
	const [isExpanded, setIsExpanded] = useState(!isBoard);
	const summarySections = getSummarySections(document, isCompact);
	const visibleSections =
		isBoard && !isExpanded ? summarySections.slice(0, 1) : summarySections;
	const handleToggleClick = () => {
		setIsExpanded((current) => !current);
	};

	return (
		<article style={documentCardStyle}>
			<div style={documentHeaderStyle}>
				<div style={sectionStackCompactStyle}>
					<p style={documentKindStyle}>{getDocumentKindLabel(document.kind)}</p>
					<h3 style={documentTitleStyle}>{document.title}</h3>
				</div>
				{document.routePath ? (
					<code style={routePathStyle}>{document.routePath}</code>
				) : null}
			</div>
			{document.metadata.length > 0 ? (
				<ul style={metadataListStyle}>
					{document.metadata.map((metadataLine) => (
						<li key={metadataLine}>{metadataLine}</li>
					))}
				</ul>
			) : null}
			{document.summary ? (
				<div style={markdownBlockStyle}>
					<Markdown>{document.summary}</Markdown>
				</div>
			) : null}
			<div style={sectionStackCompactStyle}>
				{visibleSections.map((section) => (
					<section
						key={`${document.id}:${section.heading}`}
						style={summarySectionStyle}
					>
						<h4 style={summaryHeadingStyle}>{section.heading}</h4>
						<div style={markdownBlockStyle}>
							<Markdown>{section.content}</Markdown>
						</div>
					</section>
				))}
			</div>
			{isBoard && summarySections.length > 1 ? (
				<button
					onClick={handleToggleClick}
					style={secondaryButtonStyle}
					type="button"
				>
					{isExpanded ? "접기" : "더 보기"}
				</button>
			) : null}
		</article>
	);
}

function RawDocumentCard({ document }: { document: PlanningDocument }) {
	return (
		<article style={documentCardStyle}>
			<div style={documentHeaderStyle}>
				<div style={sectionStackCompactStyle}>
					<p style={documentKindStyle}>{getDocumentKindLabel(document.kind)}</p>
					<h3 style={documentTitleStyle}>{document.title}</h3>
				</div>
				{document.routePath ? (
					<code style={routePathStyle}>{document.routePath}</code>
				) : null}
			</div>
			<div style={markdownBlockStyle}>
				<Markdown>{document.rawMarkdown}</Markdown>
			</div>
		</article>
	);
}

function CodexEditLauncher({
	codexEnabled,
	componentName,
	storyId,
	storyTitle,
	targetFiles,
}: {
	codexEnabled: boolean;
	componentName: string;
	storyId: string;
	storyTitle: string;
	targetFiles: string[];
}) {
	const [isOpen, setIsOpen] = useState(false);
	const handleOpenClick = () => {
		setIsOpen(true);
	};
	const handleCloseClick = () => {
		setIsOpen(false);
	};

	if (!codexEnabled) {
		return null;
	}

	return (
		<>
			<div style={codexLauncherStyle}>
				<div style={codexLauncherCopyStyle}>
					<strong style={codexLauncherTitleStyle}>Storybook Codex</strong>
					<p style={codexLauncherDescriptionStyle}>
						현재 story에 연결된 spec만 수정하고, 결과는 `main` 대상 draft PR로
						발행합니다.
					</p>
				</div>
				<button
					aria-label="Codex로 수정"
					disabled={targetFiles.length === 0}
					onClick={handleOpenClick}
					style={{
						...codexPrimaryButtonStyle,
						...(targetFiles.length === 0 ? disabledButtonStyle : null),
					}}
					type="button"
				>
					Codex로 수정
				</button>
			</div>
			{isOpen ? (
				<CodexEditDialog
					componentName={componentName}
					onClose={handleCloseClick}
					storyId={storyId}
					storyTitle={storyTitle}
					targetFiles={targetFiles}
				/>
			) : null}
		</>
	);
}

function CodexEditDialog({
	componentName,
	onClose,
	storyId,
	storyTitle,
	targetFiles,
}: {
	componentName: string;
	onClose: () => void;
	storyId: string;
	storyTitle: string;
	targetFiles: string[];
}) {
	const [capabilityState, setCapabilityState] = useState<CodexCapabilityState>({
		data: null,
		message: null,
		status: "idle",
	});
	const [instruction, setInstruction] = useState("");
	const [job, setJob] = useState<CodexJobSnapshot | null>(null);
	const [requestError, setRequestError] = useState<string | null>(null);
	const eventSourceRef = useRef<EventSource | null>(null);
	const pollingTimerRef = useRef<number | null>(null);
	const canRunJob =
		capabilityState.data?.available === true &&
		instruction.trim().length > 0 &&
		targetFiles.length > 0 &&
		job?.status !== "running" &&
		job?.status !== "publishing";
	const canPublishJob = Boolean(
		job &&
			job.status === "ready" &&
			job.touchedFiles.length > 0 &&
			job.prUrl === null,
	);

	const clearRealtimeHandles = () => {
		if (eventSourceRef.current) {
			eventSourceRef.current.close();
			eventSourceRef.current = null;
		}
		if (pollingTimerRef.current !== null) {
			window.clearTimeout(pollingTimerRef.current);
			pollingTimerRef.current = null;
		}
	};

	const syncJobResult = async (jobId: string) => {
		try {
			const response = await fetch(`/__codex/jobs/${jobId}/result`, {
				cache: "no-store",
			});
			const payload = await readResponseJson<{ job: CodexJobSnapshot }>(
				response,
			);
			setJob(payload.job);
		} catch (error) {
			setRequestError(
				error instanceof Error
					? error.message
					: "Codex 결과를 새로고침하지 못했습니다.",
			);
		}
	};

	const scheduleJobPoll = (jobId: string) => {
		clearRealtimeHandles();
		pollingTimerRef.current = window.setTimeout(async () => {
			try {
				const response = await fetch(`/__codex/jobs/${jobId}/result`, {
					cache: "no-store",
				});
				const payload = await readResponseJson<{ job: CodexJobSnapshot }>(
					response,
				);
				setJob(payload.job);
				if (!isCodexTerminalStatus(payload.job.status)) {
					scheduleJobPoll(jobId);
				}
			} catch (error) {
				setRequestError(
					error instanceof Error
						? error.message
						: "Codex 결과를 주기적으로 확인하지 못했습니다.",
				);
			}
		}, 1200);
	};

	const attachJobStream = (jobId: string) => {
		clearRealtimeHandles();
		if (typeof EventSource === "undefined") {
			scheduleJobPoll(jobId);
			return;
		}

		const eventSource = new EventSource(`/__codex/jobs/${jobId}/events`);
		eventSourceRef.current = eventSource;
		eventSource.onmessage = (event) => {
			try {
				const payload = JSON.parse(event.data) as { job?: CodexJobSnapshot };
				if (!payload.job) {
					return;
				}

				setJob(payload.job);
				if (isCodexTerminalStatus(payload.job.status)) {
					eventSource.close();
					eventSourceRef.current = null;
					void syncJobResult(payload.job.id);
				}
			} catch {
				// ignore malformed event payloads
			}
		};
		eventSource.onerror = () => {
			eventSource.close();
			eventSourceRef.current = null;
			scheduleJobPoll(jobId);
		};
	};

	useEffect(() => {
		let isCancelled = false;

		const loadCapabilities = async () => {
			setCapabilityState({
				data: null,
				message: null,
				status: "loading",
			});

			try {
				const response = await fetch(CODEX_CAPABILITIES_PATH, {
					cache: "no-store",
				});
				const payload = await readResponseJson<CodexCapabilities>(response);
				if (isCancelled) {
					return;
				}

				setCapabilityState({
					data: payload,
					message: null,
					status: "ready",
				});
			} catch (error) {
				if (isCancelled) {
					return;
				}

				setCapabilityState({
					data: null,
					message:
						error instanceof Error
							? error.message
							: "Codex bridge 상태를 확인하지 못했습니다.",
					status: "error",
				});
			}
		};

		void loadCapabilities();

		return () => {
			isCancelled = true;
			clearRealtimeHandles();
		};
	}, []);

	const handleInstructionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setInstruction(event.target.value);
	};

	const handleRunClick = async () => {
		setRequestError(null);
		clearRealtimeHandles();

		try {
			const response = await fetch("/__codex/jobs", {
				body: JSON.stringify({
					componentName,
					instruction: instruction.trim(),
					storyId,
					storyTitle,
					targetFiles,
				}),
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
			});
			const payload = await readResponseJson<{ job: CodexJobSnapshot }>(
				response,
			);
			setJob(payload.job);
			attachJobStream(payload.job.id);
		} catch (error) {
			setRequestError(
				error instanceof Error
					? error.message
					: "Codex 작업을 시작하지 못했습니다.",
			);
		}
	};

	const handlePublishClick = async () => {
		if (!job) {
			return;
		}

		setRequestError(null);
		setJob({
			...job,
			status: "publishing",
		});

		try {
			const response = await fetch(`/__codex/jobs/${job.id}/publish-pr`, {
				body: JSON.stringify({}),
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
			});
			const payload = await readResponseJson<{ job: CodexJobSnapshot }>(
				response,
			);
			setJob(payload.job);
		} catch (error) {
			setRequestError(
				error instanceof Error
					? error.message
					: "Draft PR 발행에 실패했습니다.",
			);
			await syncJobResult(job.id);
		}
	};

	const handleResetClick = () => {
		setJob(null);
		setRequestError(null);
		clearRealtimeHandles();
	};

	return (
		<div style={codexModalOverlayStyle}>
			<section aria-label="Codex edit dialog" style={codexModalStyle}>
				<header style={codexModalHeaderStyle}>
					<div style={sectionStackCompactStyle}>
						<p style={eyebrowStyle}>Storybook Codex</p>
						<h3 style={codexModalTitleStyle}>{componentName}</h3>
						<p style={descriptionStyle}>
							현재는 route/pure screen에 연결된 spec만 수정하고, 승인 후 `main`
							대상 draft PR을 생성합니다.
						</p>
					</div>
					<button onClick={onClose} style={secondaryButtonStyle} type="button">
						닫기
					</button>
				</header>
				<div style={codexModalBodyStyle}>
					<section style={codexInfoCardStyle}>
						<div style={codexInfoGridStyle}>
							<div style={sectionStackCompactStyle}>
								<strong style={codexInfoLabelStyle}>Story</strong>
								<span style={codexInfoValueStyle}>{storyTitle}</span>
							</div>
							<div style={sectionStackCompactStyle}>
								<strong style={codexInfoLabelStyle}>Publish Base</strong>
								<span style={codexInfoValueStyle}>main</span>
							</div>
						</div>
						<div style={sectionStackCompactStyle}>
							<strong style={codexInfoLabelStyle}>Editable Spec</strong>
							<ul style={codexTargetListStyle}>
								{targetFiles.map((targetFile) => (
									<li key={targetFile}>
										<code style={codexInlineCodeStyle}>{targetFile}</code>
									</li>
								))}
							</ul>
						</div>
						<div style={sectionStackCompactStyle}>
							<strong style={codexInfoLabelStyle}>Bridge Status</strong>
							{capabilityState.status === "loading" ? (
								<span style={codexInfoValueStyle}>
									로컬 Codex bridge 확인 중...
								</span>
							) : null}
							{capabilityState.status === "error" ? (
								<p style={codexWarningStyle}>
									{capabilityState.message ??
										"Codex bridge 상태를 확인하지 못했습니다."}
								</p>
							) : null}
							{capabilityState.status === "ready" ? (
								<div style={sectionStackCompactStyle}>
									<span style={codexInfoValueStyle}>
										{capabilityState.data?.available
											? `codex ${capabilityState.data.codexVersion ?? "unknown"} / gh ${capabilityState.data.ghVersion ?? "unknown"}`
											: (capabilityState.data?.reason ??
												"로컬 Codex bridge를 사용할 수 없습니다.")}
									</span>
									{capabilityState.data?.available ? null : (
										<p style={codexWarningStyle}>
											로컬 dev Storybook에서만 지원되며 `codex`, `gh`, `gh auth`
											상태가 모두 준비되어야 합니다.
										</p>
									)}
								</div>
							) : null}
						</div>
					</section>

					<section style={documentCardStyle}>
						<div style={sectionStackCompactStyle}>
							<strong style={codexInfoLabelStyle}>Instruction</strong>
							<textarea
								onChange={handleInstructionChange}
								placeholder="예: 권한 정책 변경에 맞게 이 페이지 기획서를 업데이트해 주세요."
								style={codexTextareaStyle}
								value={instruction}
							/>
							<div style={codexButtonRowStyle}>
								<button
									disabled={!canRunJob}
									onClick={handleRunClick}
									style={{
										...codexPrimaryButtonStyle,
										...(!canRunJob ? disabledButtonStyle : null),
									}}
									type="button"
								>
									{job?.status === "running" ? "실행 중..." : "Codex 실행"}
								</button>
								<button
									onClick={handleResetClick}
									style={secondaryButtonStyle}
									type="button"
								>
									결과 버리기
								</button>
							</div>
						</div>
						{requestError ? (
							<p style={codexWarningStyle}>{requestError}</p>
						) : null}
					</section>

					{job ? (
						<section style={codexResultGridStyle}>
							<article style={documentCardStyle}>
								<div style={sectionStackCompactStyle}>
									<div style={chipRowStyle}>
										<InfoChip label={`Status: ${job.status}`} />
										{job.branchName ? (
											<InfoChip label={`Branch: ${job.branchName}`} />
										) : null}
									</div>
									<strong style={codexInfoLabelStyle}>Summary</strong>
									<div style={codexSummaryStyle}>
										{job.summary ?? "Codex 요약을 기다리는 중입니다."}
									</div>
									{job.warnings.length > 0 ? (
										<div style={sectionStackCompactStyle}>
											<strong style={codexInfoLabelStyle}>Warnings</strong>
											<ul style={codexWarningListStyle}>
												{job.warnings.map((warning) => (
													<li key={warning}>{warning}</li>
												))}
											</ul>
										</div>
									) : null}
									<div style={sectionStackCompactStyle}>
										<strong style={codexInfoLabelStyle}>Touched Files</strong>
										{job.touchedFiles.length > 0 ? (
											<ul style={codexTargetListStyle}>
												{job.touchedFiles.map((targetFile) => (
													<li key={targetFile}>
														<code style={codexInlineCodeStyle}>
															{targetFile}
														</code>
													</li>
												))}
											</ul>
										) : (
											<span style={codexInfoValueStyle}>
												아직 허용된 spec 변경이 없습니다.
											</span>
										)}
									</div>
									<div style={codexButtonRowStyle}>
										<button
											disabled={!canPublishJob}
											onClick={handlePublishClick}
											style={{
												...codexPrimaryButtonStyle,
												...(!canPublishJob ? disabledButtonStyle : null),
											}}
											type="button"
										>
											{job.status === "publishing"
												? "Draft PR 생성 중..."
												: "Publish PR"}
										</button>
										<button
											onClick={handleRunClick}
											style={secondaryButtonStyle}
											type="button"
										>
											다시 실행
										</button>
									</div>
									{job.prUrl ? (
										<a
											href={job.prUrl}
											rel="noreferrer"
											style={storyLinkStyle}
											target="_blank"
										>
											Open Draft PR
										</a>
									) : null}
								</div>
							</article>
							<article style={documentCardStyle}>
								<div style={sectionStackCompactStyle}>
									<strong style={codexInfoLabelStyle}>Execution Log</strong>
									<div style={codexLogStyle}>
										{job.logs.length === 0 ? (
											<span style={codexInfoValueStyle}>
												아직 로그가 없습니다.
											</span>
										) : (
											job.logs.map((logEntry) => (
												<div key={logEntry.id} style={codexLogEntryStyle}>
													<span style={codexLogMetaStyle}>
														[{logEntry.stream}]
													</span>
													<span>{logEntry.message}</span>
												</div>
											))
										)}
									</div>
								</div>
							</article>
						</section>
					) : null}
				</div>
			</section>
		</div>
	);
}

function ToggleButton({
	isActive,
	label,
	onClick,
}: {
	isActive: boolean;
	label: string;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			style={{
				...toggleButtonStyle,
				...(isActive ? toggleButtonActiveStyle : null),
			}}
			type="button"
		>
			{label}
		</button>
	);
}

function InfoChip({ label }: { label: string }) {
	return <span style={infoChipStyle}>{label}</span>;
}

function EmptyState({
	description,
	title,
}: {
	description: string;
	title: string;
}) {
	return (
		<section style={emptyStateStyle}>
			<h3 style={emptyStateTitleStyle}>{title}</h3>
			<p style={emptyStateDescriptionStyle}>{description}</p>
		</section>
	);
}

function getSummarySections(document: PlanningDocument, isCompact = false) {
	const preferredHeadings =
		document.kind === "route-page"
			? routeSectionHeadings
			: purePageSectionHeadings;
	const matchedSections = preferredHeadings
		.map((heading) =>
			document.sections.find((section) => section.heading === heading),
		)
		.filter(
			(section): section is NonNullable<typeof section> =>
				section !== undefined,
		);

	if (matchedSections.length > 0) {
		return isCompact ? matchedSections.slice(0, 1) : matchedSections;
	}

	return document.sections
		.filter((section) => section.heading !== "변경 이력")
		.slice(0, isCompact ? 1 : 3);
}

function getDocumentKindLabel(kind: PlanningDocumentKind) {
	return kind === "route-page" ? "Route Spec" : "Pure Screen Spec";
}

const panelStyle: CSSProperties = {
	display: "grid",
	gap: 16,
	padding: 16,
	color: "#E5E7EB",
};

const headerStyle: CSSProperties = {
	display: "grid",
	gap: 10,
	padding: 16,
	borderRadius: 18,
	background:
		"radial-gradient(circle at top right, rgba(94, 234, 212, 0.18), transparent 36%), rgba(15, 23, 42, 0.92)",
	border: "1px solid rgba(148, 163, 184, 0.18)",
};

const eyebrowStyle: CSSProperties = {
	margin: 0,
	fontSize: 11,
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	color: "#5EEAD4",
};

const titleStyle: CSSProperties = {
	margin: 0,
	fontSize: 22,
	lineHeight: 1.2,
	color: "#F8FAFC",
};

const descriptionStyle: CSSProperties = {
	margin: 0,
	fontSize: 13,
	lineHeight: 1.6,
	color: "#CBD5E1",
};

const chipRowStyle: CSSProperties = {
	display: "flex",
	flexWrap: "wrap",
	gap: 8,
};

const infoChipStyle: CSSProperties = {
	display: "inline-flex",
	alignItems: "center",
	padding: "4px 10px",
	borderRadius: 999,
	background: "rgba(30, 41, 59, 0.9)",
	border: "1px solid rgba(148, 163, 184, 0.18)",
	fontSize: 12,
	fontWeight: 700,
	color: "#E2E8F0",
};

const storyLinkStyle: CSSProperties = {
	color: "#5EEAD4",
	fontSize: 13,
	fontWeight: 700,
	textDecoration: "none",
};

const codexLauncherStyle: CSSProperties = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	flexWrap: "wrap",
	gap: 12,
	padding: 14,
	borderRadius: 16,
	background: "rgba(8, 47, 73, 0.38)",
	border: "1px solid rgba(34, 211, 238, 0.16)",
};

const codexLauncherCopyStyle: CSSProperties = {
	display: "grid",
	gap: 4,
	flex: "1 1 240px",
};

const codexLauncherTitleStyle: CSSProperties = {
	fontSize: 13,
	color: "#ECFEFF",
};

const codexLauncherDescriptionStyle: CSSProperties = {
	margin: 0,
	fontSize: 12,
	lineHeight: 1.6,
	color: "#CFFAFE",
};

const codexPrimaryButtonStyle: CSSProperties = {
	border: "1px solid rgba(34, 211, 238, 0.28)",
	borderRadius: 12,
	background:
		"linear-gradient(135deg, rgba(8, 145, 178, 0.96), rgba(20, 184, 166, 0.96))",
	color: "#ECFEFF",
	cursor: "pointer",
	fontSize: 12,
	fontWeight: 800,
	padding: "10px 14px",
};

const disabledButtonStyle: CSSProperties = {
	cursor: "not-allowed",
	opacity: 0.56,
};

const codexModalOverlayStyle: CSSProperties = {
	position: "fixed",
	inset: 0,
	zIndex: 80,
	display: "grid",
	placeItems: "center",
	padding: 20,
	background: "rgba(2, 6, 23, 0.72)",
	backdropFilter: "blur(14px)",
};

const codexModalStyle: CSSProperties = {
	display: "grid",
	gridTemplateRows: "auto minmax(0, 1fr)",
	width: "min(960px, 100%)",
	maxHeight: "min(88vh, 920px)",
	overflow: "hidden",
	borderRadius: 24,
	border: "1px solid rgba(148, 163, 184, 0.18)",
	background:
		"radial-gradient(circle at top right, rgba(34, 211, 238, 0.1), transparent 28%), rgba(15, 23, 42, 0.98)",
	boxShadow: "0 32px 80px rgba(2, 6, 23, 0.48)",
};

const codexModalHeaderStyle: CSSProperties = {
	display: "flex",
	alignItems: "flex-start",
	justifyContent: "space-between",
	gap: 16,
	padding: "18px 20px",
	borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
};

const codexModalTitleStyle: CSSProperties = {
	margin: 0,
	fontSize: 24,
	lineHeight: 1.2,
	color: "#F8FAFC",
};

const codexModalBodyStyle: CSSProperties = {
	display: "grid",
	gap: 16,
	padding: 20,
	overflow: "auto",
	alignContent: "start",
};

const codexInfoCardStyle: CSSProperties = {
	display: "grid",
	gap: 14,
	padding: 16,
	borderRadius: 16,
	background: "rgba(15, 23, 42, 0.82)",
	border: "1px solid rgba(148, 163, 184, 0.14)",
};

const codexInfoGridStyle: CSSProperties = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
	gap: 12,
};

const codexInfoLabelStyle: CSSProperties = {
	fontSize: 12,
	fontWeight: 700,
	textTransform: "uppercase",
	letterSpacing: "0.08em",
	color: "#7DD3FC",
};

const codexInfoValueStyle: CSSProperties = {
	fontSize: 13,
	lineHeight: 1.6,
	color: "#E2E8F0",
};

const codexTargetListStyle: CSSProperties = {
	display: "grid",
	gap: 8,
	margin: 0,
	paddingLeft: 18,
	color: "#CBD5E1",
	fontSize: 13,
};

const codexInlineCodeStyle: CSSProperties = {
	fontSize: 12,
	color: "#C4B5FD",
	wordBreak: "break-word",
};

const codexTextareaStyle: CSSProperties = {
	minHeight: 144,
	width: "100%",
	borderRadius: 16,
	border: "1px solid rgba(148, 163, 184, 0.18)",
	background: "rgba(15, 23, 42, 0.94)",
	color: "#F8FAFC",
	padding: 14,
	fontSize: 14,
	lineHeight: 1.6,
	resize: "vertical",
};

const codexButtonRowStyle: CSSProperties = {
	display: "flex",
	flexWrap: "wrap",
	gap: 10,
};

const codexResultGridStyle: CSSProperties = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
	gap: 16,
};

const codexSummaryStyle: CSSProperties = {
	whiteSpace: "pre-wrap",
	fontSize: 13,
	lineHeight: 1.7,
	color: "#E2E8F0",
};

const codexWarningStyle: CSSProperties = {
	margin: 0,
	fontSize: 13,
	lineHeight: 1.6,
	color: "#FCA5A5",
};

const codexWarningListStyle: CSSProperties = {
	display: "grid",
	gap: 6,
	margin: 0,
	paddingLeft: 18,
	fontSize: 13,
	lineHeight: 1.6,
	color: "#FCA5A5",
};

const codexLogStyle: CSSProperties = {
	display: "grid",
	gap: 8,
	maxHeight: 280,
	overflow: "auto",
	padding: 12,
	borderRadius: 12,
	background: "rgba(2, 6, 23, 0.58)",
	border: "1px solid rgba(148, 163, 184, 0.12)",
};

const codexLogEntryStyle: CSSProperties = {
	display: "grid",
	gap: 2,
	fontSize: 12,
	lineHeight: 1.6,
	color: "#CBD5E1",
};

const codexLogMetaStyle: CSSProperties = {
	fontSize: 11,
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	color: "#94A3B8",
};

const toggleRowStyle: CSSProperties = {
	display: "grid",
	gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
	gap: 8,
};

const toggleButtonStyle: CSSProperties = {
	border: "1px solid rgba(148, 163, 184, 0.18)",
	borderRadius: 12,
	background: "rgba(15, 23, 42, 0.78)",
	color: "#CBD5E1",
	cursor: "pointer",
	fontSize: 13,
	fontWeight: 700,
	padding: "10px 12px",
};

const toggleButtonActiveStyle: CSSProperties = {
	background: "rgba(14, 165, 233, 0.18)",
	border: "1px solid rgba(56, 189, 248, 0.42)",
	color: "#F8FAFC",
};

const groupStyle: CSSProperties = {
	display: "grid",
	gap: 12,
};

const groupHeaderStyle: CSSProperties = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: 12,
};

const groupEyebrowStyle: CSSProperties = {
	margin: 0,
	fontSize: 12,
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	color: "#93C5FD",
};

const groupValueStyle: CSSProperties = {
	fontSize: 13,
	color: "#CBD5E1",
};

const sectionStackStyle: CSSProperties = {
	display: "grid",
	gap: 12,
};

const boardGridStyle: CSSProperties = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
	gap: 12,
	alignItems: "start",
};

const sectionStackCompactStyle: CSSProperties = {
	display: "grid",
	gap: 8,
};

const documentCardStyle: CSSProperties = {
	display: "grid",
	gap: 12,
	padding: 16,
	borderRadius: 16,
	background: "rgba(15, 23, 42, 0.82)",
	border: "1px solid rgba(148, 163, 184, 0.14)",
};

const documentHeaderStyle: CSSProperties = {
	display: "grid",
	gap: 8,
};

const documentKindStyle: CSSProperties = {
	margin: 0,
	fontSize: 11,
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	color: "#94A3B8",
};

const documentTitleStyle: CSSProperties = {
	margin: 0,
	fontSize: 16,
	lineHeight: 1.35,
	color: "#F8FAFC",
};

const routePathStyle: CSSProperties = {
	fontSize: 12,
	color: "#93C5FD",
	wordBreak: "break-word",
};

const metadataListStyle: CSSProperties = {
	display: "grid",
	gap: 6,
	margin: 0,
	paddingLeft: 16,
	fontSize: 12,
	color: "#94A3B8",
};

const summarySectionStyle: CSSProperties = {
	display: "grid",
	gap: 8,
};

const summaryHeadingStyle: CSSProperties = {
	margin: 0,
	fontSize: 13,
	color: "#E2E8F0",
};

const markdownBlockStyle: CSSProperties = {
	fontSize: 13,
	lineHeight: 1.7,
	color: "#CBD5E1",
};

const secondaryButtonStyle: CSSProperties = {
	border: "1px solid rgba(148, 163, 184, 0.18)",
	borderRadius: 12,
	background: "rgba(30, 41, 59, 0.72)",
	color: "#E2E8F0",
	cursor: "pointer",
	fontSize: 12,
	fontWeight: 700,
	padding: "8px 10px",
	justifySelf: "start",
};

const emptyStateStyle: CSSProperties = {
	display: "grid",
	gap: 8,
	padding: 16,
	borderRadius: 16,
	background: "rgba(15, 23, 42, 0.72)",
	border: "1px dashed rgba(148, 163, 184, 0.2)",
};

const emptyStateTitleStyle: CSSProperties = {
	margin: 0,
	fontSize: 16,
	color: "#F8FAFC",
};

const emptyStateDescriptionStyle: CSSProperties = {
	margin: 0,
	fontSize: 13,
	lineHeight: 1.6,
	color: "#94A3B8",
};

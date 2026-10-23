import { observer } from "mobx-react-lite";
import type { DolmenAgentActivity } from "../data/dolmenChatClient";
import { getActivityMeasurements } from "../data/dolmenDiagnostics";
export const DeveloperOverviewPanel = observer(function DeveloperOverviewPanel({
	activities,
}: {
	activities: DolmenAgentActivity[];
}) {
	const latestActivity = activities.at(-1);
	const measurements = latestActivity
		? getActivityMeasurements(latestActivity)
		: undefined;
	const displayMs = (elapsedMs: number | undefined) =>
		elapsedMs === undefined ? "미수집" : `${elapsedMs.toFixed(1)}ms`;
	return (
		<section
			aria-label="브라우저 관측 개요"
			className="rounded-xl border border-border p-3 text-xs"
		>
			<h3 className="font-semibold">이 브라우저 관측</h3>
			<p className="mt-2">
				정상 {activities.filter((activity) => activity.phase === "done").length}{" "}
				· 실패{" "}
				{activities.filter((activity) => activity.phase === "error").length} ·
				취소{" "}
				{activities.filter((activity) => activity.phase === "cancelled").length}
			</p>
			<p className="mt-1 text-foreground/60">
				최신 요청의 시간입니다. 정상 종료는 done 수신으로만 판단합니다.
			</p>
			<dl className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-1">
				<dt>서버 TTFT</dt>
				<dd>{displayMs(measurements?.serverTtftMs)}</dd>
				<dt>서버 총시간</dt>
				<dd>{displayMs(measurements?.serverTotalMs)}</dd>
				<dt>브라우저 TTFT</dt>
				<dd>{displayMs(measurements?.clientTtftMs)}</dd>
				<dt>브라우저 총시간</dt>
				<dd>{displayMs(measurements?.clientTotalMs)}</dd>
				<dt>서버 답변 시도</dt>
				<dd>{measurements?.attempts ?? "미수집"}</dd>
			</dl>
			<p className="mt-2 text-foreground/60">
				TTFT는 첫 본문까지의 시간입니다. 서버와 브라우저의 시작 기준은 다릅니다.
			</p>
		</section>
	);
});
DeveloperOverviewPanel.displayName = "DeveloperOverviewPanel";

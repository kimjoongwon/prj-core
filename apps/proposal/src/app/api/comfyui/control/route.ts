import { exec, spawn } from "node:child_process";
import { closeSync, existsSync, openSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { NextRequest, NextResponse } from "next/server";

const execAsync = promisify(exec);

const COMFYUI_DIR = process.env.COMFYUI_DIR || join(homedir(), "ComfyUI");
const COMFYUI_PORT = process.env.COMFYUI_PORT || "8188";
const SCRIPTS_DIR = join(process.cwd(), "scripts");
const LOG_FILE = join(tmpdir(), "comfyui.log");

interface ControlResponse {
	success: boolean;
	message: string;
	installed?: boolean;
	running?: boolean;
	pid?: number;
}

/**
 * ComfyUI 설치 여부 확인
 */
function isInstalled(): boolean {
	return existsSync(join(COMFYUI_DIR, "main.py"));
}

/**
 * ComfyUI 실행 중인지 확인
 */
async function getRunningPid(): Promise<number | null> {
	try {
		const { stdout } = await execAsync(`lsof -t -i :${COMFYUI_PORT}`);
		const pid = parseInt(stdout.trim(), 10);
		return Number.isNaN(pid) ? null : pid;
	} catch {
		return null;
	}
}

/**
 * GET: 상태 조회
 */
export async function GET(): Promise<NextResponse<ControlResponse>> {
	const installed = isInstalled();
	const pid = await getRunningPid();

	return NextResponse.json({
		success: true,
		message: installed
			? pid
				? "ComfyUI가 실행 중입니다."
				: "ComfyUI가 설치되어 있지만 실행 중이지 않습니다."
			: "ComfyUI가 설치되어 있지 않습니다.",
		installed,
		running: pid !== null,
		pid: pid ?? undefined,
	});
}

/**
 * POST: 시작/중지/설치
 */
export async function POST(
	request: NextRequest,
): Promise<NextResponse<ControlResponse>> {
	const body = await request.json();
	const action = body.action as "start" | "stop" | "install";

	switch (action) {
		case "install":
			return handleInstall();
		case "start":
			return handleStart();
		case "stop":
			return handleStop();
		default:
			return NextResponse.json(
				{ success: false, message: "Invalid action" },
				{ status: 400 },
			);
	}
}

/**
 * ComfyUI 설치
 */
async function handleInstall(): Promise<NextResponse<ControlResponse>> {
	if (isInstalled()) {
		return NextResponse.json({
			success: true,
			message: "ComfyUI가 이미 설치되어 있습니다.",
			installed: true,
		});
	}

	const scriptPath = join(SCRIPTS_DIR, "install-comfyui.sh");

	if (!existsSync(scriptPath)) {
		return NextResponse.json(
			{ success: false, message: "설치 스크립트를 찾을 수 없습니다." },
			{ status: 500 },
		);
	}

	try {
		// 백그라운드로 설치 실행 (시간이 오래 걸림)
		spawn("bash", [scriptPath], {
			detached: true,
			stdio: "ignore",
			env: { ...process.env, COMFYUI_DIR },
		}).unref();

		return NextResponse.json({
			success: true,
			message:
				"ComfyUI 설치가 시작되었습니다. 완료까지 몇 분이 걸릴 수 있습니다.",
			installed: false,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				message: `설치 실패: ${error instanceof Error ? error.message : "Unknown error"}`,
			},
			{ status: 500 },
		);
	}
}

/**
 * ComfyUI 시작
 */
async function handleStart(): Promise<NextResponse<ControlResponse>> {
	if (!isInstalled()) {
		return NextResponse.json(
			{
				success: false,
				message: "ComfyUI가 설치되어 있지 않습니다. 먼저 설치해주세요.",
			},
			{ status: 400 },
		);
	}

	const pid = await getRunningPid();
	if (pid) {
		return NextResponse.json({
			success: true,
			message: "ComfyUI가 이미 실행 중입니다.",
			installed: true,
			running: true,
			pid,
		});
	}

	try {
		// bash를 통해 venv 활성화 후 실행 (로그 파일에 출력 저장)
		const logFd = openSync(LOG_FILE, "w");
		const startCommand = `cd "${COMFYUI_DIR}" && source venv/bin/activate && python main.py --listen 127.0.0.1 --port ${COMFYUI_PORT}`;

		const child = spawn("bash", ["-c", startCommand], {
			cwd: COMFYUI_DIR,
			detached: true,
			stdio: ["ignore", logFd, logFd],
		});

		child.unref();
		closeSync(logFd);

		// 시작 대기 (ComfyUI는 초기화에 시간이 걸림)
		await new Promise((resolve) => setTimeout(resolve, 8000));

		const newPid = await getRunningPid();

		return NextResponse.json({
			success: true,
			message: newPid
				? "ComfyUI가 시작되었습니다."
				: "ComfyUI 시작 중입니다. 잠시 후 다시 확인해주세요. (로그: " +
					LOG_FILE +
					")",
			installed: true,
			running: newPid !== null,
			pid: newPid ?? undefined,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				message: `시작 실패: ${error instanceof Error ? error.message : "Unknown error"}`,
			},
			{ status: 500 },
		);
	}
}

/**
 * ComfyUI 중지
 */
async function handleStop(): Promise<NextResponse<ControlResponse>> {
	const pid = await getRunningPid();

	if (!pid) {
		return NextResponse.json({
			success: true,
			message: "ComfyUI가 실행 중이지 않습니다.",
			installed: isInstalled(),
			running: false,
		});
	}

	try {
		await execAsync(`kill ${pid}`);

		// 종료 대기
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// 강제 종료 필요 시
		const stillRunning = await getRunningPid();
		if (stillRunning) {
			await execAsync(`kill -9 ${stillRunning}`);
		}

		return NextResponse.json({
			success: true,
			message: "ComfyUI가 중지되었습니다.",
			installed: isInstalled(),
			running: false,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				message: `중지 실패: ${error instanceof Error ? error.message : "Unknown error"}`,
			},
			{ status: 500 },
		);
	}
}

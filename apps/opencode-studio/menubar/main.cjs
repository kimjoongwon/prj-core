const {
	app,
	BrowserWindow,
	Menu,
	Tray,
	dialog,
	nativeImage,
	screen,
	shell,
} = require("electron");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const APP_PORT = Number(process.env.OPENCODE_STUDIO_PORT ?? 3010);
const APP_URL = process.env.OPENCODE_STUDIO_URL ?? `http://127.0.0.1:${APP_PORT}`;
const SUMMARY_URL = new URL("/api/runs/summary", APP_URL).toString();
const DEV_APP_ROOT = path.resolve(__dirname, "..");

const WINDOW_WIDTH = 1100;
const WINDOW_HEIGHT = 760;
const SERVER_BOOT_TIMEOUT_MS = 90_000;
const SERVER_BOOT_RETRY_MS = 400;
const STATUS_POLL_INTERVAL_MS = 3000;
const FETCH_TIMEOUT_MS = 2000;

const SETTINGS_FILE_NAME = "settings.json";

const BLANK_TRAY_ICON_DATA_URL =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7Z9f8AAAAASUVORK5CYII=";

let tray = null;
let windowRef = null;
let statusTimer = null;
let studioServerProcess = null;
let launchedServer = false;
let isRestartingServer = false;
let isQuitting = false;
let statusLabel = "Booting OpenCode Studio...";
let summary = null;
let projectDirectory = "";

void app.whenReady().then(async () => {
	if (process.platform === "darwin") {
		app.dock.hide();
	}

	projectDirectory = resolveProjectDirectory();
	tray = createTray();
	windowRef = createWindow();

	try {
		await ensureServer();
		if (windowRef) {
			await windowRef.loadURL(APP_URL);
		}
		statusLabel = "Studio connected";
	} catch (error) {
		statusLabel = toErrorMessage(error);
	}

	refreshTray();
	startStatusPolling();
});

app.on("before-quit", () => {
	isQuitting = true;
	stopStatusPolling();
	stopLaunchedServer();
});

app.on("activate", () => {
	showWindow();
});

app.on("window-all-closed", (event) => {
	event.preventDefault();
});

function createTray() {
	const icon = nativeImage.createFromDataURL(BLANK_TRAY_ICON_DATA_URL);
	icon.setTemplateImage(true);

	const createdTray = new Tray(icon);
	createdTray.setToolTip("OpenCode Studio");
	createdTray.on("click", () => {
		toggleWindow();
	});
	createdTray.on("right-click", () => {
		createdTray.popUpContextMenu(buildMenu());
	});
	return createdTray;
}

function createWindow() {
	const browserWindow = new BrowserWindow({
		width: WINDOW_WIDTH,
		height: WINDOW_HEIGHT,
		show: false,
		autoHideMenuBar: true,
		title: "OpenCode Studio",
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true,
		},
	});

	browserWindow.on("close", (event) => {
		if (isQuitting) {
			return;
		}

		event.preventDefault();
		browserWindow.hide();
	});

	browserWindow.on("blur", () => {
		if (!isQuitting) {
			browserWindow.hide();
		}
	});

	return browserWindow;
}

function toggleWindow() {
	if (!windowRef) {
		return;
	}

	if (windowRef.isVisible()) {
		windowRef.hide();
		return;
	}

	showWindow();
}

function showWindow() {
	if (!windowRef || !tray) {
		return;
	}

	const trayBounds = tray.getBounds();
	const windowBounds = windowRef.getBounds();
	const display = screen.getDisplayNearestPoint({
		x: trayBounds.x,
		y: trayBounds.y,
	});
	const workArea = display.workArea;

	const targetX = Math.round(
		trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2,
	);
	const minX = workArea.x;
	const maxX = Math.max(
		workArea.x,
		workArea.x + workArea.width - windowBounds.width,
	);
	const nextX = clamp(targetX, minX, maxX);
	const nextY =
		process.platform === "darwin"
			? workArea.y + 28
			: trayBounds.y + trayBounds.height;

	windowRef.setPosition(nextX, nextY, false);
	windowRef.show();
	windowRef.focus();
}

function buildMenu() {
	const activityLabel = summary
		? `${summary.activeSubagentCalls} active subagent calls / ${summary.runningRuns} running sessions`
		: "No activity data yet";

	const projectLabel = projectDirectory
		? `Project: ${projectDirectory}`
		: "Project: all session directories";

	return Menu.buildFromTemplate([
		{ label: statusLabel, enabled: false },
		{ label: projectLabel, enabled: false },
		{ type: "separator" },
		{ label: activityLabel, enabled: false },
		{ type: "separator" },
		{
			label: "Open Studio",
			click: () => {
				showWindow();
			},
		},
		{
			label: "Open in Browser",
			click: () => {
				void shell.openExternal(APP_URL);
			},
		},
		{
			label: "Select Project Folder...",
			click: () => {
				void selectProjectFolder();
			},
		},
		{
			label: "Use All Sessions",
			click: () => {
				clearProjectFolder();
			},
		},
		{
			label: "Reload",
			click: () => {
				if (windowRef) {
					windowRef.reload();
				}
			},
		},
		{ type: "separator" },
		{
			label: "Quit",
			click: () => {
				isQuitting = true;
				app.quit();
			},
		},
	]);
}

function refreshTray() {
	if (!tray) {
		return;
	}

	tray.setTitle(toTrayTitle(summary));
	tray.setContextMenu(buildMenu());
}

function toTrayTitle(nextSummary) {
	if (!nextSummary) {
		return "OC ...";
	}

	if (nextSummary.activeSubagentCalls > 0) {
		return `OC ${nextSummary.activeSubagentCalls}`;
	}

	if (nextSummary.runningRuns > 0) {
		return `OC ${nextSummary.runningRuns}`;
	}

	if (nextSummary.failedRuns > 0) {
		return "OC !";
	}

	return "OC";
}

async function ensureServer() {
	const existingSummary = await fetchSummary();
	if (existingSummary) {
		summary = existingSummary;
		statusLabel = "Connected to existing Studio server";
		return;
	}

	statusLabel = "Starting Studio server...";
	refreshTray();
	startLocalServer();

	const started = await waitForServer();
	if (!started) {
		throw new Error("Studio server did not become ready within 90s");
	}

	statusLabel = "Studio server ready";
}

function startLocalServer() {
	if (studioServerProcess) {
		return;
	}

	if (app.isPackaged) {
		startBundledServer();
		return;
	}

	startDevServer();
}

function startDevServer() {
	const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
	const env = createStudioServerEnv("development");
	const processRef = spawn(command, ["start:dev"], {
		cwd: DEV_APP_ROOT,
		env,
		stdio: ["ignore", "pipe", "pipe"],
	});

	launchedServer = true;
	studioServerProcess = processRef;
	attachServerProcessEvents(processRef);
}

function startBundledServer() {
	const serverScript = resolveStandaloneServerScript();
	if (!serverScript) {
		throw new Error(
			"Bundled Next server was not found. Run mac:build first to generate standalone output.",
		);
	}

	const env = {
		...createStudioServerEnv("production"),
		ELECTRON_RUN_AS_NODE: "1",
	};

	const processRef = spawn(process.execPath, [serverScript], {
		cwd: path.dirname(serverScript),
		env,
		stdio: ["ignore", "pipe", "pipe"],
	});

	launchedServer = true;
	studioServerProcess = processRef;
	attachServerProcessEvents(processRef);
}

function createStudioServerEnv(mode) {
	const env = {
		...process.env,
		PORT: String(APP_PORT),
		HOSTNAME: "127.0.0.1",
		NODE_ENV: mode,
	};

	if (projectDirectory) {
		env.OPENCODE_PROJECT_DIR = projectDirectory;
	} else {
		delete env.OPENCODE_PROJECT_DIR;
	}

	return env;
}

function resolveStandaloneServerScript() {
	const appPath = app.getAppPath();
	const candidates = [
		path.join(appPath, ".next", "standalone", "apps", "opencode-studio", "server.js"),
		path.join(appPath, ".next", "standalone", "server.js"),
		path.join(
			process.resourcesPath,
			"app",
			".next",
			"standalone",
			"apps",
			"opencode-studio",
			"server.js",
		),
		path.join(
			process.resourcesPath,
			"app",
			".next",
			"standalone",
			"server.js",
		),
	];

	for (const candidate of candidates) {
		if (fs.existsSync(candidate)) {
			return candidate;
		}
	}

	return "";
}

function attachServerProcessEvents(processRef) {
	processRef.stdout?.on("data", (chunk) => {
		process.stdout.write(`[studio] ${String(chunk)}`);
	});

	processRef.stderr?.on("data", (chunk) => {
		process.stderr.write(`[studio] ${String(chunk)}`);
	});

	processRef.on("exit", (code, signal) => {
		if (studioServerProcess === processRef) {
			studioServerProcess = null;
		}

		const wasManaged = launchedServer;
		launchedServer = false;
		if (isQuitting || isRestartingServer || !wasManaged) {
			return;
		}

		statusLabel = `Studio server exited (${signal ?? code ?? "unknown"})`;
		refreshTray();
	});
}

function stopLaunchedServer() {
	if (!launchedServer || !studioServerProcess) {
		return;
	}

	if (!studioServerProcess.killed) {
		studioServerProcess.kill("SIGTERM");
	}

	studioServerProcess = null;
	launchedServer = false;
}

function restartLaunchedServer() {
	if (!launchedServer) {
		return;
	}

	void (async () => {
		isRestartingServer = true;
		stopLaunchedServer();
		statusLabel = "Restarting Studio server...";
		refreshTray();

		startLocalServer();
		const started = await waitForServer();
		statusLabel = started
			? "Studio server ready"
			: "Studio server restart timed out";
		isRestartingServer = false;
		refreshTray();
	})();
}

async function selectProjectFolder() {
	const result = await dialog.showOpenDialog({
		properties: ["openDirectory"],
	});

	if (result.canceled || result.filePaths.length === 0) {
		return;
	}

	projectDirectory = result.filePaths[0];
	writeSettings({ projectDirectory });
	statusLabel = `Project set: ${projectDirectory}`;
	refreshTray();
	restartLaunchedServer();
}

function clearProjectFolder() {
	projectDirectory = "";
	writeSettings({ projectDirectory: "" });
	statusLabel = "Project filter cleared";
	refreshTray();
	restartLaunchedServer();
}

function resolveProjectDirectory() {
	const envDirectory = process.env.OPENCODE_PROJECT_DIR?.trim();
	if (envDirectory) {
		return envDirectory;
	}

	const savedDirectory = readSettings().projectDirectory?.trim();
	if (savedDirectory) {
		return savedDirectory;
	}

	const candidates = [
		process.cwd(),
		path.resolve(process.cwd(), "../.."),
		DEV_APP_ROOT,
		path.resolve(DEV_APP_ROOT, "../.."),
	];

	for (const candidate of candidates) {
		if (hasOpencodeDirectory(candidate)) {
			return candidate;
		}
	}

	return "";
}

function hasOpencodeDirectory(targetPath) {
	if (!targetPath) {
		return false;
	}

	try {
		return fs.existsSync(path.join(targetPath, ".opencode"));
	} catch {
		return false;
	}
}

function readSettings() {
	const settingsPath = getSettingsPath();
	if (!fs.existsSync(settingsPath)) {
		return { projectDirectory: "" };
	}

	try {
		const content = fs.readFileSync(settingsPath, "utf8");
		const parsed = JSON.parse(content);
		if (!parsed || typeof parsed !== "object") {
			return { projectDirectory: "" };
		}

		return {
			projectDirectory:
				typeof parsed.projectDirectory === "string"
					? parsed.projectDirectory
					: "",
		};
	} catch {
		return { projectDirectory: "" };
	}
}

function writeSettings(settings) {
	const settingsPath = getSettingsPath();
	const directory = path.dirname(settingsPath);

	try {
		fs.mkdirSync(directory, { recursive: true });
		fs.writeFileSync(
			settingsPath,
			JSON.stringify(
				{
					projectDirectory: settings.projectDirectory ?? "",
				},
				null,
				2,
			),
			"utf8",
		);
	} catch {
		return;
	}
}

function getSettingsPath() {
	return path.join(app.getPath("userData"), SETTINGS_FILE_NAME);
}

async function waitForServer() {
	const startedAt = Date.now();

	while (Date.now() - startedAt < SERVER_BOOT_TIMEOUT_MS) {
		const nextSummary = await fetchSummary();
		if (nextSummary) {
			summary = nextSummary;
			return true;
		}

		await sleep(SERVER_BOOT_RETRY_MS);
	}

	return false;
}

function startStatusPolling() {
	void pullSummary();
	statusTimer = setInterval(() => {
		void pullSummary();
	}, STATUS_POLL_INTERVAL_MS);
}

function stopStatusPolling() {
	if (!statusTimer) {
		return;
	}

	clearInterval(statusTimer);
	statusTimer = null;
}

async function pullSummary() {
	const nextSummary = await fetchSummary();
	if (!nextSummary) {
		statusLabel = "Studio server unreachable";
		refreshTray();
		return;
	}

	summary = nextSummary;
	statusLabel = "Studio connected";
	refreshTray();
}

async function fetchSummary() {
	const controller = new AbortController();
	const timeout = setTimeout(() => {
		controller.abort();
	}, FETCH_TIMEOUT_MS);

	try {
		const response = await fetch(SUMMARY_URL, {
			method: "GET",
			cache: "no-store",
			signal: controller.signal,
		});

		if (!response.ok) {
			return null;
		}

		const payload = await response.json();
		if (!isSummaryShape(payload)) {
			return null;
		}

		return payload;
	} catch {
		return null;
	} finally {
		clearTimeout(timeout);
	}
}

function isSummaryShape(value) {
	if (!value || typeof value !== "object") {
		return false;
	}

	return (
		typeof value.totalRuns === "number" &&
		typeof value.runningRuns === "number" &&
		typeof value.failedRuns === "number" &&
		typeof value.activeSubagentCalls === "number"
	);
}

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

function toErrorMessage(error) {
	if (error instanceof Error && error.message) {
		return error.message;
	}

	return "Failed to start OpenCode Studio";
}

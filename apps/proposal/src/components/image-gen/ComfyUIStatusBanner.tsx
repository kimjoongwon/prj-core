"use client";

import {
	type ConnectionStatus,
	type StatusAction,
	StatusBanner,
	type StatusInfo,
} from "@cocrepo/ui";
import { Cpu, Download, ExternalLink, Play, Square } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import type { ComfyUIHealthResponse } from "@/app/api/comfyui/health/route";

interface ControlStatus {
	installed: boolean;
	running: boolean;
	pid?: number;
}

interface ComfyUIStatusBannerProps {
	onConnectionChange?: (connected: boolean) => void;
}

/**
 * ComfyUI 상태 및 제어 배너
 * StatusBanner를 ComfyUI 제어에 맞게 커스터마이징
 */
export const ComfyUIStatusBanner = observer(
	({ onConnectionChange }: ComfyUIStatusBannerProps) => {
		const [status, setStatus] = useState<ComfyUIHealthResponse | null>(null);
		const [controlStatus, setControlStatus] = useState<ControlStatus | null>(
			null,
		);
		const [isChecking, setIsChecking] = useState(false);
		const [isControlling, setIsControlling] = useState(false);
		const [actionMessage, setActionMessage] = useState<string | null>(null);
		const [lastChecked, setLastChecked] = useState<Date | undefined>(undefined);

		const checkConnection = async () => {
			setIsChecking(true);
			try {
				const [healthRes, controlRes] = await Promise.all([
					fetch("/api/comfyui/health"),
					fetch("/api/comfyui/control"),
				]);
				const healthData: ComfyUIHealthResponse = await healthRes.json();
				const controlData = await controlRes.json();

				setStatus(healthData);
				setControlStatus({
					installed: controlData.installed ?? false,
					running: controlData.running ?? false,
					pid: controlData.pid,
				});
				setLastChecked(new Date());
				onConnectionChange?.(healthData.connected);
			} catch {
				setStatus({
					connected: false,
					url: "http://localhost:8188",
					error: "API 요청 실패",
				});
				onConnectionChange?.(false);
			} finally {
				setIsChecking(false);
			}
		};

		const handleControl = async (action: "install" | "start" | "stop") => {
			setIsControlling(true);
			setActionMessage(null);

			try {
				const response = await fetch("/api/comfyui/control", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ action }),
				});
				const data = await response.json();

				setActionMessage(data.message);

				if (action === "start") {
					setTimeout(checkConnection, 5000);
				} else {
					setTimeout(checkConnection, 1000);
				}
			} catch (error) {
				setActionMessage(
					`실패: ${error instanceof Error ? error.message : "Unknown error"}`,
				);
			} finally {
				setIsControlling(false);
			}
		};

		useEffect(() => {
			checkConnection();
		}, []);

		useEffect(() => {
			const interval = setInterval(checkConnection, 30000);
			return () => clearInterval(interval);
		}, []);

		useEffect(() => {
			if (actionMessage) {
				const timer = setTimeout(() => setActionMessage(null), 5000);
				return () => clearTimeout(timer);
			}
		}, [actionMessage]);

		const getDeviceInfo = () => {
			if (!status?.systemStats?.devices?.length) return null;
			const device = status.systemStats.devices[0];
			const vramTotal = (device.vram_total / 1024 / 1024 / 1024).toFixed(1);
			const vramFree = (device.vram_free / 1024 / 1024 / 1024).toFixed(1);
			return { name: device.name, vramTotal, vramFree };
		};

		const deviceInfo = getDeviceInfo();
		const isConnected = status?.connected;
		const isInstalled = controlStatus?.installed;

		// 연결 상태 결정
		const connectionStatus: ConnectionStatus = isChecking
			? "checking"
			: isConnected
				? "connected"
				: "disconnected";

		// 상태별 라벨
		const statusLabel = isConnected
			? "연결됨"
			: isInstalled
				? "중지됨"
				: "미설치";

		// 추가 상태 정보
		const statusInfos: StatusInfo[] = [];

		if (isConnected && status?.queue) {
			statusInfos.push({
				label: "큐",
				value: `${status.queue.running}/${status.queue.pending}`,
				tooltip: "실행 중 / 대기 중",
				icon: <Cpu className="w-3 h-3" />,
			});
		}

		if (deviceInfo) {
			statusInfos.push({
				label: "GPU",
				value: deviceInfo.name,
				tooltip: `VRAM: ${deviceInfo.vramFree}GB / ${deviceInfo.vramTotal}GB 사용 가능`,
			});
		}

		// 액션 버튼들
		const actions: StatusAction[] = [];

		if (!isInstalled) {
			actions.push({
				id: "install",
				label: "ComfyUI 설치",
				icon: <Download className="w-4 h-4" />,
				color: "primary",
				variant: "solid",
				onPress: () => handleControl("install"),
				showWhen: ["disconnected"],
			});
		}

		if (isInstalled && !isConnected) {
			actions.push({
				id: "start",
				label: "시작",
				icon: <Play className="w-4 h-4" />,
				color: "success",
				variant: "solid",
				onPress: () => handleControl("start"),
				showWhen: ["disconnected"],
			});
		}

		if (isConnected) {
			actions.push({
				id: "stop",
				label: "중지",
				icon: <Square className="w-4 h-4" />,
				color: "danger",
				variant: "flat",
				onPress: () => handleControl("stop"),
				showWhen: ["connected"],
			});

			actions.push({
				id: "open",
				label: "ComfyUI 열기",
				icon: <ExternalLink className="w-3 h-3" />,
				color: "primary",
				variant: "flat",
				onPress: () => window.open(status?.url, "_blank"),
				showWhen: ["connected"],
			});
		}

		// 안내 메시지 결정
		let message: string | undefined;
		if (actionMessage) {
			message = actionMessage;
		} else if (!isInstalled && !isChecking) {
			message =
				'ComfyUI가 설치되어 있지 않습니다. "ComfyUI 설치" 버튼을 클릭하여 자동으로 설치할 수 있습니다.';
		} else if (isInstalled && !isConnected && !isChecking) {
			message =
				'ComfyUI가 설치되어 있지만 실행 중이지 않습니다. "시작" 버튼을 클릭하여 ComfyUI를 시작하세요.';
		}

		return (
			<StatusBanner
				status={connectionStatus}
				serviceName="ComfyUI"
				serviceUrl={status?.url || "http://localhost:8188"}
				connectedLabel={statusLabel}
				disconnectedLabel={statusLabel}
				checkingLabel="확인 중..."
				onRefresh={checkConnection}
				isRefreshing={isChecking}
				lastChecked={lastChecked}
				statusInfos={statusInfos}
				actions={actions}
				message={message}
				isProcessing={isControlling}
			/>
		);
	},
);

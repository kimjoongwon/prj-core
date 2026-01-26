"use client";

import type { ComfyUIHealthResponse } from "@/app/api/comfyui/health/route";
import { Button, Chip, Spinner, Tooltip } from "@heroui/react";
import {
  AlertCircle,
  CheckCircle2,
  Cpu,
  Download,
  ExternalLink,
  Play,
  Power,
  RefreshCw,
  Server,
  Square,
  Wifi,
  WifiOff,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

interface ControlStatus {
  installed: boolean;
  running: boolean;
  pid?: number;
}

interface ComfyUIStatusBannerProps {
  onConnectionChange?: (connected: boolean) => void;
}

export const ComfyUIStatusBanner = observer(
  ({ onConnectionChange }: ComfyUIStatusBannerProps) => {
    const [status, setStatus] = useState<ComfyUIHealthResponse | null>(null);
    const [controlStatus, setControlStatus] = useState<ControlStatus | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [isControlling, setIsControlling] = useState(false);
    const [actionMessage, setActionMessage] = useState<string | null>(null);
    const [lastChecked, setLastChecked] = useState<Date | null>(null);

    const checkConnection = async () => {
      setIsChecking(true);
      try {
        // 연결 상태 및 컨트롤 상태 동시 조회
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

        // 액션 후 상태 재확인 (시작은 약간의 딜레이 후)
        if (action === "start") {
          setTimeout(checkConnection, 5000);
        } else {
          setTimeout(checkConnection, 1000);
        }
      } catch (error) {
        setActionMessage(
          `실패: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      } finally {
        setIsControlling(false);
      }
    };

    // 초기 연결 체크
    useEffect(() => {
      checkConnection();
    }, []);

    // 30초마다 자동 체크
    useEffect(() => {
      const interval = setInterval(checkConnection, 30000);
      return () => clearInterval(interval);
    }, []);

    // 액션 메시지 자동 숨김
    useEffect(() => {
      if (actionMessage) {
        const timer = setTimeout(() => setActionMessage(null), 5000);
        return () => clearTimeout(timer);
      }
    }, [actionMessage]);

    const formatLastChecked = () => {
      if (!lastChecked) return "";
      const diff = Math.floor((Date.now() - lastChecked.getTime()) / 1000);
      if (diff < 60) return `${diff}초 전`;
      return `${Math.floor(diff / 60)}분 전`;
    };

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

    return (
      <div
        className={`rounded-xl p-4 mb-6 border transition-all ${
          isConnected
            ? "bg-success/10 border-success/30"
            : isInstalled
              ? "bg-warning/10 border-warning/30"
              : "bg-danger/10 border-danger/30"
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* 좌측: 연결 상태 */}
          <div className="flex items-center gap-4">
            {/* 상태 아이콘 */}
            <div
              className={`p-2 rounded-lg ${
                isConnected
                  ? "bg-success/20"
                  : isInstalled
                    ? "bg-warning/20"
                    : "bg-danger/20"
              }`}
            >
              {isChecking ? (
                <Spinner size="sm" color="current" />
              ) : isConnected ? (
                <Wifi className="w-5 h-5 text-success" />
              ) : isInstalled ? (
                <Power className="w-5 h-5 text-warning" />
              ) : (
                <WifiOff className="w-5 h-5 text-danger" />
              )}
            </div>

            {/* 상태 텍스트 */}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {isConnected
                    ? "ComfyUI 연결됨"
                    : isInstalled
                      ? "ComfyUI 중지됨"
                      : "ComfyUI 미설치"}
                </span>
                <Chip
                  size="sm"
                  color={isConnected ? "success" : isInstalled ? "warning" : "danger"}
                  variant="flat"
                  startContent={
                    isConnected ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )
                  }
                >
                  {isConnected ? "Online" : isInstalled ? "Stopped" : "Not Installed"}
                </Chip>
              </div>
              <div className="flex items-center gap-2 text-sm text-default-500 mt-1">
                <Server className="w-3 h-3" />
                <span>{status?.url || "http://localhost:8188"}</span>
                {lastChecked && (
                  <span className="text-default-400">
                    (마지막 확인: {formatLastChecked()})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 우측: 추가 정보 및 액션 */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* 큐 상태 */}
            {isConnected && status?.queue && (
              <Tooltip content="실행 중 / 대기 중">
                <Chip size="sm" variant="flat" startContent={<Cpu className="w-3 h-3" />}>
                  큐: {status.queue.running}/{status.queue.pending}
                </Chip>
              </Tooltip>
            )}

            {/* GPU 정보 */}
            {deviceInfo && (
              <Tooltip
                content={`VRAM: ${deviceInfo.vramFree}GB / ${deviceInfo.vramTotal}GB 사용 가능`}
              >
                <Chip size="sm" variant="flat" color="secondary">
                  {deviceInfo.name}
                </Chip>
              </Tooltip>
            )}

            {/* 새로고침 버튼 */}
            <Tooltip content="상태 새로고침">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={checkConnection}
                isDisabled={isChecking || isControlling}
              >
                <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
              </Button>
            </Tooltip>

            {/* 설치 버튼 */}
            {!isInstalled && (
              <Button
                size="sm"
                color="primary"
                variant="solid"
                startContent={
                  isControlling ? (
                    <Spinner size="sm" color="current" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )
                }
                onPress={() => handleControl("install")}
                isDisabled={isControlling}
              >
                ComfyUI 설치
              </Button>
            )}

            {/* 시작 버튼 */}
            {isInstalled && !isConnected && (
              <Button
                size="sm"
                color="success"
                variant="solid"
                startContent={
                  isControlling ? (
                    <Spinner size="sm" color="current" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )
                }
                onPress={() => handleControl("start")}
                isDisabled={isControlling}
              >
                시작
              </Button>
            )}

            {/* 중지 버튼 */}
            {isConnected && (
              <Button
                size="sm"
                color="danger"
                variant="flat"
                startContent={
                  isControlling ? (
                    <Spinner size="sm" color="current" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )
                }
                onPress={() => handleControl("stop")}
                isDisabled={isControlling}
              >
                중지
              </Button>
            )}

            {/* ComfyUI 열기 버튼 */}
            {isConnected && (
              <Button
                size="sm"
                variant="flat"
                color="primary"
                endContent={<ExternalLink className="w-3 h-3" />}
                onPress={() => window.open(status?.url, "_blank")}
              >
                ComfyUI 열기
              </Button>
            )}
          </div>
        </div>

        {/* 액션 메시지 */}
        {actionMessage && (
          <div className="mt-3 pt-3 border-t border-divider">
            <p className="text-sm text-default-600">{actionMessage}</p>
          </div>
        )}

        {/* 설치 안됨 시 안내 */}
        {!isInstalled && !isChecking && !actionMessage && (
          <div className="mt-3 pt-3 border-t border-danger/20">
            <p className="text-sm text-default-500">
              ComfyUI가 설치되어 있지 않습니다. "ComfyUI 설치" 버튼을 클릭하여 자동으로
              설치할 수 있습니다.
            </p>
          </div>
        )}

        {/* 설치됨 but 중지됨 시 안내 */}
        {isInstalled && !isConnected && !isChecking && !actionMessage && (
          <div className="mt-3 pt-3 border-t border-warning/20">
            <p className="text-sm text-default-500">
              ComfyUI가 설치되어 있지만 실행 중이지 않습니다. "시작" 버튼을 클릭하여
              ComfyUI를 시작하세요.
            </p>
          </div>
        )}
      </div>
    );
  }
);

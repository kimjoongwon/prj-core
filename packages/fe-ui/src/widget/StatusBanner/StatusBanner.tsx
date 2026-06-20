"use client";

import { Spinner, Tooltip } from "@heroui/react";
import {
	AlertCircle,
	CheckCircle2,
	RefreshCw,
	Server,
	Wifi,
	WifiOff,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { Button } from "../../action/Button/Button";
import { Chip } from "../../data-display/Chip/Chip";

export type ConnectionStatus = "connected" | "disconnected" | "checking";

export interface StatusAction {
	/** 액션 ID */
	id: string;
	/** 버튼 라벨 */
	label: string;
	/** 버튼 아이콘 */
	icon?: ReactNode;
	/** 버튼 색상 */
	color?: "primary" | "success" | "warning" | "danger" | "default";
	/** 버튼 variant */
	variant?: "solid" | "flat" | "light";
	/** 클릭 핸들러 */
	onPress: () => void;
	/** 표시 조건 */
	showWhen?: ConnectionStatus[];
}

export interface StatusInfo {
	/** 라벨 */
	label: string;
	/** 값 */
	value: string;
	/** 툴팁 */
	tooltip?: string;
	/** 아이콘 */
	icon?: ReactNode;
}

export interface StatusBannerProps {
	/** 연결 상태 */
	status: ConnectionStatus;
	/** 서비스 이름 */
	serviceName: string;
	/** 서비스 URL */
	serviceUrl?: string;
	/** 연결됨 라벨 */
	connectedLabel?: string;
	/** 연결 안됨 라벨 */
	disconnectedLabel?: string;
	/** 확인 중 라벨 */
	checkingLabel?: string;
	/** 새로고침 핸들러 */
	onRefresh?: () => void;
	/** 새로고침 중 여부 */
	isRefreshing?: boolean;
	/** 마지막 확인 시간 */
	lastChecked?: Date;
	/** 추가 상태 정보 */
	statusInfos?: StatusInfo[];
	/** 액션 버튼들 */
	actions?: StatusAction[];
	/** 안내 메시지 */
	message?: string;
	/** 처리 중 여부 (액션 버튼 비활성화) */
	isProcessing?: boolean;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * StatusBanner 컴포넌트
 * 서비스 연결 상태와 제어 액션을 표시하는 배너입니다.
 * 연결됨/연결안됨/확인중 상태와 새로고침/커스텀 액션을 지원합니다.
 *
 * @example
 * ```tsx
 * <StatusBanner
 *   status="connected"
 *   serviceName="ComfyUI"
 *   serviceUrl="http://localhost:8188"
 *   onRefresh={handleRefresh}
 *   lastChecked={new Date()}
 *   actions={[
 *     { id: "restart", label: "재시작", onPress: handleRestart }
 *   ]}
 * />
 * ```
 */
export const StatusBanner = observer(
	({
		status,
		serviceName,
		serviceUrl,
		connectedLabel = "연결됨",
		disconnectedLabel = "연결 안됨",
		checkingLabel = "확인 중...",
		onRefresh,
		isRefreshing = false,
		lastChecked,
		statusInfos = [],
		actions = [],
		message,
		isProcessing = false,
		className = "",
	}: StatusBannerProps) => {
		const isConnected = status === "connected";
		const isChecking = status === "checking";

		const getStatusLabel = () => {
			if (isChecking) return checkingLabel;
			if (isConnected) return connectedLabel;
			return disconnectedLabel;
		};

		const formatLastChecked = () => {
			if (!lastChecked) return "";
			const diff = Math.floor((Date.now() - lastChecked.getTime()) / 1000);
			if (diff < 60) return `${diff}초 전`;
			return `${Math.floor(diff / 60)}분 전`;
		};

		const visibleActions = actions.filter(
			(action) => !action.showWhen || action.showWhen.includes(status),
		);

		return (
			<div
				className={`rounded-xl p-4 mb-6 border transition-all ${
					isConnected
						? "bg-success/10 border-success/30"
						: "bg-danger/10 border-danger/30"
				} ${className}`}
			>
				<div className="flex items-center justify-between flex-wrap gap-4">
					{/* 좌측: 연결 상태 */}
					<div className="flex items-center gap-4">
						{/* 상태 아이콘 */}
						<div
							className={`p-2 rounded-lg ${
								isConnected ? "bg-success/20" : "bg-danger/20"
							}`}
						>
							{isChecking || isRefreshing ? (
								<Spinner size="sm" color="current" />
							) : isConnected ? (
								<Wifi className="w-5 h-5 text-success" />
							) : (
								<WifiOff className="w-5 h-5 text-danger" />
							)}
						</div>

						{/* 상태 텍스트 */}
						<div>
							<div className="flex items-center gap-2">
								<span className="font-semibold">
									{serviceName} {getStatusLabel()}
								</span>
								<Chip
									size="sm"
									color={isConnected ? "success" : "danger"}
									variant="flat"
									startContent={
										isConnected ? (
											<CheckCircle2 className="w-3 h-3" />
										) : (
											<AlertCircle className="w-3 h-3" />
										)
									}
								>
									{isConnected ? "Online" : "Offline"}
								</Chip>
							</div>
							<div className="flex items-center gap-2 text-sm text-muted mt-1">
								{serviceUrl && (
									<>
										<Server className="w-3 h-3" />
										<span>{serviceUrl}</span>
									</>
								)}
								{lastChecked && (
									<span className="text-muted">
										(마지막 확인: {formatLastChecked()})
									</span>
								)}
							</div>
						</div>
					</div>

					{/* 우측: 추가 정보 및 액션 */}
					<div className="flex items-center gap-2 flex-wrap">
						{/* 추가 상태 정보 */}
						{statusInfos.map((info) => (
							<Tooltip key={info.label}>
								<Tooltip.Trigger>
									<Chip size="sm" variant="flat" startContent={info.icon}>
										{info.label}: {info.value}
									</Chip>
								</Tooltip.Trigger>
								<Tooltip.Content>{info.tooltip || info.label}</Tooltip.Content>
							</Tooltip>
						))}

						{/* 새로고침 버튼 */}
						{onRefresh && (
							<Tooltip>
								<Tooltip.Trigger>
									<Button
										isIconOnly
										size="sm"
										variant="flat"
										onPress={onRefresh}
										isDisabled={isRefreshing || isProcessing}
									>
										<RefreshCw
											className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
										/>
									</Button>
								</Tooltip.Trigger>
								<Tooltip.Content>상태 새로고침</Tooltip.Content>
							</Tooltip>
						)}

						{/* 액션 버튼들 */}
						{visibleActions.map((action) => (
							<Button
								key={action.id}
								size="sm"
								color={action.color || "default"}
								variant={action.variant || "solid"}
								startContent={
									isProcessing ? (
										<Spinner size="sm" color="current" />
									) : (
										action.icon
									)
								}
								onPress={action.onPress}
								isDisabled={isProcessing}
							>
								{action.label}
							</Button>
						))}
					</div>
				</div>

				{/* 안내 메시지 */}
				{message && (
					<div
						className={`mt-3 pt-3 border-t ${isConnected ? "border-success/20" : "border-danger/20"}`}
					>
						<p className="text-sm text-muted">{message}</p>
					</div>
				)}
			</div>
		);
	},
);

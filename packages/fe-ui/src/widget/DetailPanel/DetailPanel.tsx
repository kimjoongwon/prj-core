"use client";

import { ArrowDownRight, ArrowUpRight, FileText } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { Chip, Divider } from "../../design-system/primitives";
import { useT } from "../../i18n";

/** 연결 관계 정의 */
export interface DetailConnection {
	/** 연결 ID */
	id: string;
	/** 연결된 아이템 ID */
	itemId: string;
	/** 연결된 아이템 이름 */
	itemName: string;
	/** 연결 타입 라벨 */
	typeLabel: string;
	/** 연결 타입 색상 */
	typeColor?: string;
	/** 아이템 아이콘 */
	icon?: ReactNode;
	/** 아이템 배경색 */
	iconBgColor?: string;
}

/** 상세 아이템 정의 */
export interface DetailItem {
	/** 아이템 ID */
	id: string;
	/** 아이템 이름 */
	name: string;
	/** 설명 */
	description?: string;
	/** 타입 라벨 */
	typeLabel?: string;
	/** 레벨 라벨 */
	levelLabel?: string;
	/** 경로 라벨 */
	pathLabel?: string;
	/** 아이콘 */
	icon?: ReactNode;
	/** 배경색 (헤더) */
	headerBgColor?: string;
	/** 아이콘 배경색 */
	iconBgColor?: string;
	/** 메타데이터 */
	metadata?: Record<string, string | number | boolean>;
	/** 들어오는 연결 */
	incomingConnections?: DetailConnection[];
	/** 나가는 연결 */
	outgoingConnections?: DetailConnection[];
}

export interface DetailPanelProps {
	/** 선택된 아이템 */
	item: DetailItem | null;
	/** 연결된 아이템 클릭 콜백 */
	onConnectionClick?: (itemId: string) => void;
	/** 액션 버튼 (상단에 표시) */
	actionButton?: ReactNode;
	/** 빈 상태 메시지 */
	emptyMessage?: string;
	/** 빈 상태 설명 */
	emptyDescription?: string;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * DetailPanel 컴포넌트
 * 선택된 아이템의 상세 정보와 연결 관계를 표시하는 패널입니다.
 * 메타데이터, 들어오는/나가는 연결 관계를 시각화합니다.
 *
 * @example
 * ```tsx
 * <DetailPanel
 *   item={{
 *     id: "user-1",
 *     name: "사용자 관리",
 *     description: "사용자 CRUD 기능",
 *     levelLabel: "L3",
 *     incomingConnections: [{ id: "c1", itemId: "auth", itemName: "인증", typeLabel: "depends" }],
 *   }}
 *   onConnectionClick={handleConnectionClick}
 *   actionButton={<Button>편집</Button>}
 * />
 * ```
 */
export const DetailPanel = observer(
	({
		item,
		onConnectionClick,
		actionButton,
		emptyMessage = "아이템을 선택하면",
		emptyDescription = "상세 정보가 표시됩니다",
		className = "",
	}: DetailPanelProps) => {
		const t = useT();
		if (!item) {
			return (
				<div
					className={`flex h-full flex-col items-center justify-center p-4 text-center text-default-400 ${className}`}
				>
					<FileText className="mb-2 size-8" />
					<p className="text-sm">{t(emptyMessage)}</p>
					<p className="text-sm">{t(emptyDescription)}</p>
				</div>
			);
		}

		return (
			<div
				className={`flex h-full flex-col gap-4 overflow-y-auto ${className}`}
			>
				{/* 헤더 */}
				<div
					className="rounded-lg p-3"
					style={{
						backgroundColor: item.headerBgColor
							? `${item.headerBgColor}20`
							: undefined,
					}}
				>
					<div className="mb-2 flex items-center gap-2">
						{item.icon && (
							<div
								className="flex size-8 items-center justify-center rounded-md"
								style={{ backgroundColor: item.iconBgColor }}
							>
								{item.icon}
							</div>
						)}
						<div className="flex-1">
							<h3 className="font-semibold text-default-800">{item.name}</h3>
							<p className="text-xs text-default-500">{item.id}</p>
						</div>
					</div>
					<div className="flex flex-wrap gap-1">
						{item.levelLabel && (
							<Chip
								size="sm"
								variant="flat"
								style={{
									backgroundColor: item.iconBgColor,
									color: "#ffffff",
								}}
							>
								{item.levelLabel}
							</Chip>
						)}
						{item.typeLabel && (
							<Chip size="sm" variant="flat" color="default">
								{item.typeLabel}
							</Chip>
						)}
						{item.pathLabel && (
							<Chip size="sm" variant="flat" color="primary">
								{item.pathLabel}
							</Chip>
						)}
					</div>
				</div>

				{/* 액션 버튼 */}
				{actionButton}

				{/* 설명 */}
				{item.description && (
					<div>
						<h4 className="mb-1 text-xs font-semibold text-default-500">
							{t("설명")}
						</h4>
						<p className="text-sm text-default-700">{item.description}</p>
					</div>
				)}

				{/* 메타데이터 */}
				{item.metadata && Object.keys(item.metadata).length > 0 && (
					<div>
						<h4 className="mb-1 text-xs font-semibold text-default-500">
							{t("메타데이터")}
						</h4>
						<div className="space-y-1 rounded-md bg-content2 p-2">
							{Object.entries(item.metadata).map(([key, value]) => (
								<div key={key} className="flex justify-between text-xs">
									<span className="text-default-500">{key}</span>
									<span className="font-mono text-default-700">
										{String(value)}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				<Divider />

				{/* 들어오는 연결 */}
				{item.incomingConnections && item.incomingConnections.length > 0 && (
					<div>
						<h4 className="mb-2 flex items-center gap-1 text-xs font-semibold text-default-500">
							<ArrowDownRight className="size-3" />
							{t("들어오는 연결")} ({item.incomingConnections.length})
						</h4>
						<div className="space-y-1">
							{item.incomingConnections.map((conn) => (
								<ConnectionButton
									key={conn.id}
									connection={conn}
									direction="incoming"
									onClick={() => onConnectionClick?.(conn.itemId)}
								/>
							))}
						</div>
					</div>
				)}

				{/* 나가는 연결 */}
				{item.outgoingConnections && item.outgoingConnections.length > 0 && (
					<div>
						<h4 className="mb-2 flex items-center gap-1 text-xs font-semibold text-default-500">
							<ArrowUpRight className="size-3" />
							{t("나가는 연결")} ({item.outgoingConnections.length})
						</h4>
						<div className="space-y-1">
							{item.outgoingConnections.map((conn) => (
								<ConnectionButton
									key={conn.id}
									connection={conn}
									direction="outgoing"
									onClick={() => onConnectionClick?.(conn.itemId)}
								/>
							))}
						</div>
					</div>
				)}
			</div>
		);
	},
);

/** 연결 버튼 컴포넌트 */
interface ConnectionButtonProps {
	connection: DetailConnection;
	direction: "incoming" | "outgoing";
	onClick: () => void;
}

const ConnectionButton = observer(
	({ connection, direction, onClick }: ConnectionButtonProps) => {
		return (
			<button
				type="button"
				onClick={onClick}
				className="flex w-full items-center gap-2 rounded-md bg-content2 p-2 text-left transition-colors hover:bg-content3"
			>
				{connection.icon && (
					<div
						className="flex size-6 shrink-0 items-center justify-center rounded"
						style={{ backgroundColor: connection.iconBgColor }}
					>
						{connection.icon}
					</div>
				)}
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-medium text-default-800">
						{connection.itemName}
					</p>
					<div className="flex items-center gap-1">
						{connection.typeColor && (
							<span
								className="inline-block size-2 rounded-full"
								style={{ backgroundColor: connection.typeColor }}
							/>
						)}
						<span className="text-xs text-default-500">
							{direction === "incoming" ? "← " : "→ "}
							{connection.typeLabel}
						</span>
					</div>
				</div>
			</button>
		);
	},
);

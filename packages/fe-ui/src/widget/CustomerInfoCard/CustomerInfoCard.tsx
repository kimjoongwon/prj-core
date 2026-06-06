"use client";

import { Calendar, Mail, Phone, User } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Card } from "@heroui/react";

export interface CustomerInfoCardProps {
	/** 고객 이름 */
	name: string;
	/** 이메일 */
	email?: string;
	/** 전화번호 */
	phone?: string;
	/** 가입일 */
	joinedAt?: string;
	/** 문의 이력 수 */
	inquiryCount?: number;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * CustomerInfoCard 컴포넌트
 * 고객의 기본 정보(이름, 이메일, 전화번호, 가입일)와 문의 이력 수를 표시합니다.
 *
 * @example
 * ```tsx
 * <CustomerInfoCard
 *   name="홍길동"
 *   email="hong@example.com"
 *   phone="010-1234-5678"
 *   joinedAt="2025.01.15"
 *   inquiryCount={5}
 * />
 * ```
 */
export const CustomerInfoCard = observer(
	({
		name,
		email,
		phone,
		joinedAt,
		inquiryCount,
		className = "",
	}: CustomerInfoCardProps) => {
		return (
			<Card className={`bg-surface ${className}`}>
				<Card.Content className="gap-3 p-4">
					{/* 헤더 */}
					<h3 className="text-sm font-semibold text-muted">
						📞 고객 정보
					</h3>

					{/* 고객 이름 */}
					<div className="flex items-center gap-2">
						<User className="size-4 text-muted" />
						<span className="font-semibold text-foreground">{name}</span>
						{email && (
							<span className="text-sm text-muted">({email})</span>
						)}
					</div>

					{/* 연락처 */}
					{phone && (
						<div className="flex items-center gap-2">
							<Phone className="size-4 text-muted" />
							<span className="text-sm text-foreground">{phone}</span>
						</div>
					)}

					{/* 가입일 */}
					{joinedAt && (
						<div className="flex items-center gap-2">
							<Calendar className="size-4 text-muted" />
							<span className="text-sm text-muted">가입일:</span>
							<span className="text-sm text-foreground">{joinedAt}</span>
						</div>
					)}

					{/* 문의 이력 */}
					{(inquiryCount !== undefined || inquiryCount !== 0) && (
						<div className="flex items-center gap-2">
							<Mail className="size-4 text-muted" />
							<span className="text-sm text-muted">📋 문의 이력:</span>
							<span className="text-sm font-medium text-foreground">
								{inquiryCount}건
							</span>
						</div>
					)}
				</Card.Content>
			</Card>
		);
	},
);

CustomerInfoCard.displayName = "CustomerInfoCard";

"use client";

import {
	type PaymentDto,
	type PaymentReferenceDto,
	type PaymentSubjectDto,
	useGetPayments,
} from "@cocrepo/api/core/payments";

type PaymentStatusTone =
	| "success"
	| "warning"
	| "danger"
	| "secondary"
	| "default";

export interface PaymentDataPayment {
	id: string;
	title: string;
	spaceLabel: string;
	payerLabel: string;
	subjectLabel: string;
	referenceLabel: string;
	amountLabel: string;
	providerLabel: string;
	methodLabel: string;
	requestedAtLabel: string;
	approvedAtLabel: string;
	statusLabel: string;
	statusTone: PaymentStatusTone;
}

export interface PaymentDataSummary {
	totalPaymentCount: number;
	paidAmountLabel: string;
	pendingPaymentCount: number;
	serviceCount: number;
	spaceCount: number;
}

const fallbackCurrency = "KRW";

const statusLabels: Record<string, string> = {
	PENDING: "결제 대기",
	PAID: "결제 완료",
	FAILED: "결제 실패",
	CANCELED: "결제 취소",
	REFUNDED: "환불",
	PARTIALLY_REFUNDED: "부분 환불",
};

const methodLabels: Record<string, string> = {
	CARD: "카드",
	BANK_TRANSFER: "계좌이체",
	VIRTUAL_ACCOUNT: "가상계좌",
	CASH: "현금",
	FREE: "무상",
	OTHER: "기타",
};

const subjectTypeLabels: Record<string, string> = {
	COURSE: "Course",
	COURSE_OFFERING: "CourseOffering",
	COURSE_PASS: "CoursePass",
	ENROLLMENT: "Enrollment",
	PRODUCT: "Product",
	SUBSCRIPTION: "Subscription",
	CUSTOM: "Custom",
};

const referenceTypeLabels: Record<string, string> = {
	ENROLLMENT: "Enrollment",
	COURSE_PASS: "CoursePass",
	ORDER: "Order",
	INVOICE: "Invoice",
	EXTERNAL_PAYMENT: "External Payment",
	CUSTOM: "Custom",
};

/**
 * 금액과 통화 코드를 화면 표시 문자열로 변환합니다.
 */
function formatCurrency(amount: number, currency?: string | null) {
	const resolvedCurrency = currency || fallbackCurrency;

	try {
		return new Intl.NumberFormat("ko-KR", {
			style: "currency",
			currency: resolvedCurrency,
			maximumFractionDigits: 0,
		}).format(amount);
	} catch {
		return `${amount.toLocaleString("ko-KR")} ${resolvedCurrency}`;
	}
}

/**
 * API 날짜 문자열을 결제 관리 표시용 날짜로 변환합니다.
 */
function getDateLabel(value?: string | null) {
	if (!value) return "미정";

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "미정";

	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, "0");
	const day = `${date.getDate()}`.padStart(2, "0");

	return `${year}.${month}.${day}`;
}

/**
 * 결제 status 값을 UI tone으로 정규화합니다.
 */
function getStatusTone(status?: string): PaymentStatusTone {
	if (status === "PAID") return "success";
	if (status === "PENDING") return "warning";
	if (status === "FAILED" || status === "CANCELED") return "danger";
	if (status === "REFUNDED" || status === "PARTIALLY_REFUNDED") {
		return "secondary";
	}
	return "default";
}

/**
 * 결제 Space 라벨을 계산합니다.
 */
function getSpaceLabel(payment: PaymentDto) {
	return payment.tenant?.space?.ground?.name ?? payment.tenantId;
}

/**
 * 결제자 라벨을 계산합니다.
 */
function getPayerLabel(payment: PaymentDto) {
	return (
		payment.payer?.name ??
		payment.payer?.email ??
		payment.payerUserId ??
		"비회원/수동"
	);
}

/**
 * 결제 대상 subject 목록을 한 줄 라벨로 변환합니다.
 */
function getSubjectLabel(subjects?: PaymentSubjectDto[]) {
	if (!subjects || subjects.length === 0) return "대상 미연결";

	const [firstSubject] = subjects;
	const typeLabel =
		subjectTypeLabels[firstSubject.subjectType] ?? firstSubject.subjectType;
	const extraCount = subjects.length - 1;
	const extraLabel = extraCount > 0 ? ` 외 ${extraCount}건` : "";

	return `${firstSubject.serviceCode} · ${typeLabel} · ${firstSubject.subjectLabel}${extraLabel}`;
}

/**
 * 결제 reference 목록을 한 줄 라벨로 변환합니다.
 */
function getReferenceLabel(references?: PaymentReferenceDto[]) {
	if (!references || references.length === 0) return "참조 없음";

	const [firstReference] = references;
	const typeLabel =
		referenceTypeLabels[firstReference.referenceType] ??
		firstReference.referenceType;
	const label = firstReference.label ?? firstReference.referenceId;
	const extraCount = references.length - 1;
	const extraLabel = extraCount > 0 ? ` 외 ${extraCount}건` : "";

	return `${firstReference.role} · ${typeLabel} · ${label}${extraLabel}`;
}

/**
 * 결제 provider 라벨을 계산합니다.
 */
function getProviderLabel(payment: PaymentDto) {
	if (payment.provider && payment.providerPaymentId) {
		return `${payment.provider} / ${payment.providerPaymentId}`;
	}

	return payment.provider ?? payment.providerPaymentId ?? "수동 기록";
}

/**
 * Payment DTO를 Payment row로 변환합니다.
 */
function toPayment(payment: PaymentDto): PaymentDataPayment {
	return {
		id: payment.id,
		title: payment.title,
		spaceLabel: getSpaceLabel(payment),
		payerLabel: getPayerLabel(payment),
		subjectLabel: getSubjectLabel(payment.subjects),
		referenceLabel: getReferenceLabel(payment.references),
		amountLabel: formatCurrency(payment.totalAmount, payment.currency),
		providerLabel: getProviderLabel(payment),
		methodLabel: payment.method
			? (methodLabels[payment.method] ?? payment.method)
			: "미정",
		requestedAtLabel: getDateLabel(payment.requestedAt),
		approvedAtLabel: getDateLabel(payment.approvedAt),
		statusLabel: statusLabels[payment.status] ?? payment.status,
		statusTone: getStatusTone(payment.status),
	};
}

/**
 * Payment 목록으로 summary metric을 계산합니다.
 */
function toSummary(payments: PaymentDto[]): PaymentDataSummary {
	const paidAmount = payments
		.filter((payment) => payment.status === "PAID")
		.reduce((total, payment) => total + payment.totalAmount, 0);
	const pendingPaymentCount = payments.filter(
		(payment) => payment.status === "PENDING",
	).length;
	const serviceCodes = new Set(
		payments.flatMap((payment) =>
			(payment.subjects ?? []).map((subject) => subject.serviceCode),
		),
	);
	const tenantIds = new Set(payments.map((payment) => payment.tenantId));

	return {
		totalPaymentCount: payments.length,
		paidAmountLabel: formatCurrency(paidAmount, fallbackCurrency),
		pendingPaymentCount,
		serviceCount: serviceCodes.size,
		spaceCount: tenantIds.size,
	};
}

/**
 * Payment API 응답을 PaymentScreen 입력 계약으로 변환합니다.
 */
export function usePaymentData() {
	const paymentsQuery = useGetPayments({
		take: 50,
		sort: ["-approvedAt", "-createdAt"],
	});
	const paymentDtos = paymentsQuery.data?.data ?? [];
	const payments = paymentDtos.map(toPayment);
	const summary = toSummary(paymentDtos);
	const queryState = {
		isLoading: paymentsQuery.isLoading,
		isFetching: paymentsQuery.isFetching,
		isError: paymentsQuery.isError,
	};
	const refetch = () => paymentsQuery.refetch();

	return {
		payments,
		summary,
		queryState,
		refetch,
	};
}

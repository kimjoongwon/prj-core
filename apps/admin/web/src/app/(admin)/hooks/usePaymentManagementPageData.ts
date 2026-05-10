import {
	type PaymentDto,
	type PaymentReferenceDto,
	type PaymentSubjectDto,
	useGetPayments,
} from "@cocrepo/api/core/payments";
import type {
	PaymentManagementPayment,
	PaymentManagementSummary,
} from "@cocrepo/ui";

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

const formatCurrency = (amount: number, currency?: string | null) => {
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
};

const getDateLabel = (value?: string | null) => {
	if (!value) return "미정";

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "미정";

	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, "0");
	const day = `${date.getDate()}`.padStart(2, "0");

	return `${year}.${month}.${day}`;
};

const getStatusTone = (
	status?: string,
): PaymentManagementPayment["statusTone"] => {
	if (status === "PAID") return "success";
	if (status === "PENDING") return "warning";
	if (status === "FAILED" || status === "CANCELED") return "danger";
	if (status === "REFUNDED" || status === "PARTIALLY_REFUNDED") {
		return "secondary";
	}
	return "default";
};

const getSpaceLabel = (payment: PaymentDto) =>
	payment.space?.ground?.name ?? payment.spaceId;

const getPayerLabel = (payment: PaymentDto) =>
	payment.payer?.name ??
	payment.payer?.email ??
	payment.payerUserId ??
	"비회원/수동";

const getSubjectLabel = (subjects?: PaymentSubjectDto[]) => {
	if (!subjects || subjects.length === 0) return "대상 미연결";

	const [firstSubject] = subjects;
	const typeLabel =
		subjectTypeLabels[firstSubject.subjectType] ?? firstSubject.subjectType;
	const extraCount = subjects.length - 1;
	const extraLabel = extraCount > 0 ? ` 외 ${extraCount}건` : "";

	return `${firstSubject.serviceCode} · ${typeLabel} · ${firstSubject.subjectLabel}${extraLabel}`;
};

const getReferenceLabel = (references?: PaymentReferenceDto[]) => {
	if (!references || references.length === 0) return "참조 없음";

	const [firstReference] = references;
	const typeLabel =
		referenceTypeLabels[firstReference.referenceType] ??
		firstReference.referenceType;
	const label = firstReference.label ?? firstReference.referenceId;
	const extraCount = references.length - 1;
	const extraLabel = extraCount > 0 ? ` 외 ${extraCount}건` : "";

	return `${firstReference.role} · ${typeLabel} · ${label}${extraLabel}`;
};

const getProviderLabel = (payment: PaymentDto) => {
	if (payment.provider && payment.providerPaymentId) {
		return `${payment.provider} / ${payment.providerPaymentId}`;
	}

	return payment.provider ?? payment.providerPaymentId ?? "수동 기록";
};

const toPayment = (payment: PaymentDto): PaymentManagementPayment => ({
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
});

const toSummary = (payments: PaymentDto[]): PaymentManagementSummary => {
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
	const spaceIds = new Set(payments.map((payment) => payment.spaceId));

	return {
		totalPaymentCount: payments.length,
		paidAmountLabel: formatCurrency(paidAmount, fallbackCurrency),
		pendingPaymentCount,
		serviceCount: serviceCodes.size,
		spaceCount: spaceIds.size,
	};
};

export const usePaymentManagementPageData = () => {
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
};

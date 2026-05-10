import {
  ReservationPaymentCheckoutScreen,
  type ReservationCheckoutSummaryItem,
  type ReservationPaymentCheckoutStatus,
  type ReservationPaymentCourseOption,
  type ReservationPaymentMethodOption,
  type ReservationPaymentProgressStep,
} from "@cocrepo/mo-ui";
import {
  getGetMyReservationsQueryKey,
  getGetReservationBookingFeedQueryKey,
  useCreateReservationCheckout,
  useGetReservationCheckoutBootstrap,
} from "@cocrepo/api/core/reservations";
import type {
  GetReservationCheckoutBootstrapParams,
  PaymentMethod,
  ReservationCheckoutBootstrapDto,
  ReservationCheckoutOptionDto,
} from "@cocrepo/api/core/model";
import { useQueryClient } from "@tanstack/react-query";
import type { Href } from "expo-router";
import { useLocalSearchParams, useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { getCoreApiBaseUrl } from "@/auth/auth-config";
import { mobileApiScopeStore } from "@/auth/mobile-api-scope";

interface CheckoutRouteParams {
  occurrenceStartAt: string;
  programId: string;
  programName: string;
  sessionId: string;
  sessionName: string;
  timeLabel: string;
  timelineId: string;
  timelineName: string;
}

const DEFAULT_PAYMENT_METHOD: PaymentMethod = "CARD";

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  BANK_TRANSFER: "계좌이체",
  CARD: "카드",
  CASH: "현장 결제",
  EXTERNAL: "간편결제",
  FREE: "무료",
  VIRTUAL_ACCOUNT: "가상계좌",
};

const PAYMENT_METHOD_DESCRIPTIONS: Record<PaymentMethod, string> = {
  BANK_TRANSFER: "계좌이체 승인처럼 처리합니다.",
  CARD: "카드 결제 승인처럼 처리합니다.",
  CASH: "현장 결제 예정으로 기록합니다.",
  EXTERNAL: "간편결제 승인처럼 처리합니다.",
  FREE: "결제 금액 없이 수강권을 발급합니다.",
  VIRTUAL_ACCOUNT: "가상계좌 발급처럼 처리합니다.",
};

const createCheckoutIdempotencyKey = () =>
  `mobile-reservation-checkout-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;

const asString = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

const resolveCheckoutParams = (
  params: ReturnType<typeof useLocalSearchParams>,
): CheckoutRouteParams => ({
  occurrenceStartAt: asString(params.occurrenceStartAt),
  programId: asString(params.programId),
  programName: asString(params.programName) || "예약 클래스",
  sessionId: asString(params.sessionId),
  sessionName: asString(params.sessionName) || "세션",
  timeLabel: asString(params.timeLabel) || "시간 미정",
  timelineId: asString(params.timelineId),
  timelineName: asString(params.timelineName) || "지점 미정",
});

const hasRequiredCheckoutParams = (params: CheckoutRouteParams) =>
  Boolean(
    params.timelineId &&
    params.sessionId &&
    params.programId &&
    params.occurrenceStartAt,
  );

const toBootstrapParams = (
  params: CheckoutRouteParams,
): GetReservationCheckoutBootstrapParams => ({
  occurrenceStartAt: params.occurrenceStartAt,
  programId: params.programId,
  sessionId: params.sessionId,
  timelineId: params.timelineId,
});

const createSummaryItems = (params: {
  bootstrap?: ReservationCheckoutBootstrapDto;
  routeParams: CheckoutRouteParams;
}): ReservationCheckoutSummaryItem[] => {
  const context = params.bootstrap?.context;

  return [
    {
      label: "클래스",
      value: context?.programName ?? params.routeParams.programName,
    },
    {
      label: "세션",
      value: context?.sessionName ?? params.routeParams.sessionName,
    },
    { label: "시간", value: params.routeParams.timeLabel },
    {
      label: "지점",
      value: context?.timelineName ?? params.routeParams.timelineName,
    },
  ];
};

const formatAmount = (amount?: number | null, currency?: string | null) => {
  if (amount === undefined || amount === null) {
    return undefined;
  }

  const formattedAmount = amount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return currency === "KRW" ? `₩${formattedAmount}` : formattedAmount;
};

const formatOptionPrice = (option: ReservationCheckoutOptionDto) =>
  `${formatAmount(option.priceAmount, option.currency) ?? "0"} ${option.currency}`;

const toCourseOptions = (
  options: readonly ReservationCheckoutOptionDto[],
): ReservationPaymentCourseOption[] =>
  options.map((option) => ({
    description: `${option.courseOfferingName} · 예약 ${option.reservationLimit}회`,
    id: option.courseOfferingId,
    meta: [`${option.durationMonths}개월`, `${option.reservationLimit}회`],
    priceLabel: formatOptionPrice(option),
    title: option.courseName,
  }));

const toPaymentMethodOptions = (
  methods: readonly PaymentMethod[],
): ReservationPaymentMethodOption[] =>
  methods.map((method) => ({
    description: PAYMENT_METHOD_DESCRIPTIONS[method],
    label: PAYMENT_METHOD_LABELS[method],
    value: method,
  }));

const getSelectedOption = (params: {
  bootstrap?: ReservationCheckoutBootstrapDto;
  selectedCourseOfferingId?: string | null;
}) =>
  params.bootstrap?.options.find(
    (option) => option.courseOfferingId === params.selectedCourseOfferingId,
  ) ?? params.bootstrap?.options[0];

const getApiErrorDescription = (error: unknown) => {
  const status = (error as { response?: { status?: number } })?.response
    ?.status;

  switch (status) {
    case 400:
      return "결제 요청 정보를 확인해 주세요.";
    case 401:
      return "로그인이 만료되었습니다. 다시 로그인한 뒤 결제를 진행해 주세요.";
    case 403:
      return "현재 공간에서 결제를 진행할 권한이 없습니다.";
    case 404:
      return "선택한 클래스에 연결된 과정을 찾을 수 없습니다.";
    case 409:
      return "이미 예약 가능한 수강권이 있거나 활성 예약이 있습니다. 홈에서 다시 확인해 주세요.";
    default:
      return "결제를 진행하지 못했습니다. 잠시 후 다시 시도해 주세요.";
  }
};

const getCheckoutStatus = (params: {
  bootstrapError: boolean;
  bootstrapLoading: boolean;
  checkoutError: boolean;
  checkoutPending: boolean;
  checkoutSuccess: boolean;
  isValid: boolean;
}): ReservationPaymentCheckoutStatus => {
  if (!params.isValid || params.bootstrapError || params.checkoutError) {
    return "error";
  }

  if (params.bootstrapLoading) {
    return "loading";
  }

  if (params.checkoutPending) {
    return "submitting";
  }

  if (params.checkoutSuccess) {
    return "success";
  }

  return "idle";
};

const getProgressSteps = (params: {
  checkout?: {
    progressSteps?: ReservationPaymentProgressStep[];
  };
  isPending: boolean;
}) => {
  if (params.checkout?.progressSteps?.length) {
    return params.checkout.progressSteps;
  }

  if (!params.isPending) {
    return [];
  }

  return [
    { id: "reservation-context", label: "예약 정보 확인", status: "COMPLETED" },
    { id: "payment-ledger", label: "결제 요청 생성", status: "CURRENT" },
    { id: "payment-approval", label: "결제 승인 처리", status: "PENDING" },
    { id: "course-pass", label: "수강권 활성화", status: "PENDING" },
    { id: "reservation", label: "예약 확정", status: "PENDING" },
  ] as ReservationPaymentProgressStep[];
};

const ReservationPaymentCheckoutRoute = observer(() => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const routeParams = resolveCheckoutParams(useLocalSearchParams());
  const requestOptions = { baseURL: getCoreApiBaseUrl() };
  const [idempotencyKey] = useState(createCheckoutIdempotencyKey);
  const [selectedCourseOfferingId, setSelectedCourseOfferingId] = useState<
    string | null
  >(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(DEFAULT_PAYMENT_METHOD);
  const isValid = hasRequiredCheckoutParams(routeParams);
  const isSpaceSelectionPending = !mobileApiScopeStore.isSpaceSelectionResolved;
  const hasSelectedSpace = Boolean(mobileApiScopeStore.spaceId);
  const isSpaceUnavailable =
    mobileApiScopeStore.isSpaceSelectionResolved && !hasSelectedSpace;
  const bootstrapQuery = useGetReservationCheckoutBootstrap(
    toBootstrapParams(routeParams),
    {
      query: { enabled: isValid && hasSelectedSpace },
      request: requestOptions,
    },
  );
  const checkoutMutation = useCreateReservationCheckout({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: getGetReservationBookingFeedQueryKey(),
        });
        void queryClient.invalidateQueries({
          queryKey: getGetMyReservationsQueryKey({ skip: 0, take: 20 }),
        });
      },
    },
    request: requestOptions,
  });
  const bootstrap = bootstrapQuery.data?.data;
  const selectedOption = getSelectedOption({
    bootstrap,
    selectedCourseOfferingId,
  });
  const status = getCheckoutStatus({
    bootstrapError: bootstrapQuery.isError,
    bootstrapLoading:
      isSpaceSelectionPending || (hasSelectedSpace && bootstrapQuery.isLoading),
    checkoutError: checkoutMutation.isError,
    checkoutPending: checkoutMutation.isPending,
    checkoutSuccess: checkoutMutation.isSuccess,
    isValid: isValid && !isSpaceUnavailable,
  });

  useEffect(() => {
    const firstOption = bootstrap?.options[0];
    if (!firstOption) {
      return;
    }

    const hasSelectedOption = bootstrap.options.some(
      (option) => option.courseOfferingId === selectedCourseOfferingId,
    );
    if (!hasSelectedOption) {
      setSelectedCourseOfferingId(firstOption.courseOfferingId);
    }
  }, [bootstrap, selectedCourseOfferingId]);

  useEffect(() => {
    const methods = bootstrap?.paymentMethods ?? [];
    if (!methods.length) {
      return;
    }

    if (!selectedPaymentMethod || !methods.includes(selectedPaymentMethod)) {
      setSelectedPaymentMethod(
        methods.includes(DEFAULT_PAYMENT_METHOD)
          ? DEFAULT_PAYMENT_METHOD
          : methods[0],
      );
    }
  }, [bootstrap, selectedPaymentMethod]);

  function handleSelectPaymentMethod(paymentMethod: string) {
    setSelectedPaymentMethod(paymentMethod as PaymentMethod);
  }

  function handlePressReservations() {
    router.replace("/reservations" as Href);
  }

  function handlePressSubmit() {
    if (
      !isValid ||
      !hasSelectedSpace ||
      !selectedOption ||
      !selectedPaymentMethod ||
      checkoutMutation.isPending ||
      checkoutMutation.isSuccess
    ) {
      return;
    }

    checkoutMutation.mutate({
      data: {
        courseOfferingId: selectedOption.courseOfferingId,
        idempotencyKey,
        occurrenceStartAt: routeParams.occurrenceStartAt,
        paymentMethod: selectedPaymentMethod,
        programId: routeParams.programId,
        sessionId: routeParams.sessionId,
        timelineId: routeParams.timelineId,
      },
    });
  }

  return (
    <ReservationPaymentCheckoutScreen
      amountLabel={formatAmount(
        selectedOption?.priceAmount,
        selectedOption?.currency,
      )}
      courseOptions={toCourseOptions(bootstrap?.options ?? [])}
      currencyLabel={selectedOption?.currency}
      errorDescription={
        !isValid
          ? "결제에 필요한 예약 정보가 누락되었습니다. 홈에서 클래스를 다시 선택해 주세요."
          : isSpaceUnavailable
            ? "예약 결제에 사용할 공간을 먼저 선택해 주세요."
            : getApiErrorDescription(
                bootstrapQuery.error ?? checkoutMutation.error,
              )
      }
      isSubmitDisabled={
        !isValid ||
        !hasSelectedSpace ||
        !selectedOption ||
        !selectedPaymentMethod ||
        bootstrapQuery.isLoading ||
        checkoutMutation.isPending ||
        checkoutMutation.isSuccess
      }
      methodOptions={toPaymentMethodOptions(bootstrap?.paymentMethods ?? [])}
      onPressReservations={handlePressReservations}
      onPressSubmit={handlePressSubmit}
      onSelectCourseOption={setSelectedCourseOfferingId}
      onSelectPaymentMethod={handleSelectPaymentMethod}
      progressSteps={getProgressSteps({
        checkout: checkoutMutation.data?.data,
        isPending: checkoutMutation.isPending,
      })}
      selectedCourseOfferingId={selectedOption?.courseOfferingId}
      selectedPaymentMethod={selectedPaymentMethod}
      status={status}
      submitLabel={
        checkoutMutation.isSuccess
          ? "결제 완료"
          : checkoutMutation.isPending
            ? "결제 진행 중"
            : "결제하고 예약하기"
      }
      summaryItems={createSummaryItems({ bootstrap, routeParams })}
    />
  );
});

export default ReservationPaymentCheckoutRoute;

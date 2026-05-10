import {
  ReservationHomeScreen,
  type BookingAvailabilityStatus,
  type BookingClassFeedItem,
  type DateStripOption,
  type ReservationHomeFeedStatus,
  type ReservationHomeFilterOption,
  type ReservationHomeFilterValue,
} from "@cocrepo/mo-ui";
import {
  getGetMyReservationsQueryKey,
  getGetReservationBookingFeedQueryKey,
  useCreateReservation,
  useGetReservationBookingFeed,
} from "@cocrepo/api/core/reservations";
import type {
  BookingFeedItemDto,
  GetReservationBookingFeedParams,
} from "@cocrepo/api/core/model";
import { useQueryClient } from "@tanstack/react-query";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { getCoreApiBaseUrl } from "@/auth/auth-config";
import { mobileApiScopeStore } from "@/auth/mobile-api-scope";

const BOOKING_WINDOW_DAYS = 14;
const DEFAULT_TAKE = 50;
const TIME_ZONE = "Asia/Seoul";
const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

type BookingFeedFilter = ReservationHomeFilterValue;

const FILTER_OPTIONS: readonly ReservationHomeFilterOption[] = [
  { label: "전체", value: "all" },
  { label: "예약 가능", value: "bookable" },
  { label: "내 예약", value: "mine" },
  { label: "대기 가능", value: "waitlist" },
];

const STATUS_LABELS: Record<BookingAvailabilityStatus, string> = {
  AVAILABLE: "예약 가능",
  BOOKING_CLOSED: "마감",
  FEW_LEFT: "마감 임박",
  RESERVED: "예약됨",
  WAITLISTED: "대기중",
  WAITLIST_OPEN: "대기 가능",
};

const pad2 = (value: number) => value.toString().padStart(2, "0");

const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

const startOfLocalDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);

const endOfLocalDay = (date: Date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const createBookingDates = () => {
  const today = startOfLocalDay(new Date());

  return Array.from({ length: BOOKING_WINDOW_DAYS }, (_item, index) =>
    addDays(today, index),
  );
};

const createIdempotencyKey = () =>
  `mobile-booking-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;

const createBookingFeedParams = (
  dates: readonly Date[],
): GetReservationBookingFeedParams => {
  const firstDate = dates[0] ?? startOfLocalDay(new Date());
  const lastDate = dates[dates.length - 1] ?? firstDate;

  return {
    dateFrom: startOfLocalDay(firstDate).toISOString(),
    dateTo: endOfLocalDay(lastDate).toISOString(),
    skip: 0,
    take: DEFAULT_TAKE,
    timeZone: TIME_ZONE,
  };
};

const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
};

const formatTimeRange = (startsAt: string, endsAt: string) =>
  `${formatTime(startsAt)} - ${formatTime(endsAt)}`;

const formatReservationDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${
    WEEKDAY_LABELS[date.getDay()]
  }요일`;
};

const getApiErrorDescription = (error: unknown) => {
  const status = (error as { response?: { status?: number } })?.response
    ?.status;

  switch (status) {
    case 400:
      return "조회 조건을 확인해 주세요.";
    case 401:
      return "로그인이 만료되었습니다. 다시 로그인한 뒤 예약해 주세요.";
    case 403:
      return "현재 공간에서 예약 권한이 없습니다.";
    case 404:
      return "예약 가능한 수업을 찾을 수 없습니다. 날짜를 바꿔 확인해 주세요.";
    case 409:
      return "이미 예약했거나 정원이 변경되었습니다. 목록을 새로고침해 주세요.";
    default:
      return "예약 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
  }
};

const isBookableStatus = (status: BookingAvailabilityStatus) =>
  status === "AVAILABLE" || status === "FEW_LEFT" || status === "WAITLIST_OPEN";

const isWaitlistStatus = (status: BookingAvailabilityStatus) =>
  status === "WAITLIST_OPEN" || status === "WAITLISTED";

const toBookingStatus = (
  item: BookingFeedItemDto,
): BookingAvailabilityStatus => {
  if (
    item.availabilityStatus === "AVAILABLE" ||
    item.availabilityStatus === "FEW_LEFT" ||
    item.availabilityStatus === "WAITLIST_OPEN" ||
    item.availabilityStatus === "RESERVED" ||
    item.availabilityStatus === "WAITLISTED" ||
    item.availabilityStatus === "BOOKING_CLOSED"
  ) {
    return item.availabilityStatus;
  }

  if (item.myReservationStatus === "CONFIRMED") {
    return "RESERVED";
  }

  if (item.myReservationStatus === "WAITLISTED") {
    return "WAITLISTED";
  }

  return item.availableSeatCount > 0 ? "AVAILABLE" : "WAITLIST_OPEN";
};

const toBookingClassCardItem = (
  item: BookingFeedItemDto,
): BookingClassFeedItem => {
  const status = toBookingStatus(item);

  return {
    availableCount: item.availableSeatCount,
    capacity: item.capacity,
    coachName: item.coachName ?? "미정",
    confirmedCount: item.confirmedCount,
    ctaLabel: item.ctaLabel,
    id: item.feedItemId,
    level: item.level ?? undefined,
    myReservationStatus: item.myReservationStatus ?? undefined,
    previewExerciseTags: item.previewExerciseNames ?? [],
    programName: item.programName,
    routineLabel: item.routineLabelSnapshot ?? undefined,
    sessionName: item.sessionName,
    status,
    statusLabel: STATUS_LABELS[status],
    timeLabel: formatTimeRange(item.startsAt, item.endsAt),
    timelineName: item.timelineName,
    waitlistCount: item.waitlistCount,
  };
};

const createCheckoutParams = (item: BookingFeedItemDto) => ({
  occurrenceStartAt: item.startsAt,
  programId: item.programId,
  programName: item.programName,
  sessionId: item.sessionId,
  sessionName: item.sessionName,
  timeLabel: formatTimeRange(item.startsAt, item.endsAt),
  timelineId: item.timelineId,
  timelineName: item.timelineName,
});

const getFeedItemsForDate = (
  items: readonly BookingFeedItemDto[],
  selectedDate: string,
) => items.filter((item) => item.date === selectedDate);

const getFilteredFeedItems = (params: {
  filter: BookingFeedFilter;
  items: readonly BookingFeedItemDto[];
}) =>
  params.items.filter((item) => {
    const status = toBookingStatus(item);

    if (params.filter === "bookable") {
      return isBookableStatus(status);
    }

    if (params.filter === "mine") {
      return status === "RESERVED" || status === "WAITLISTED";
    }

    if (params.filter === "waitlist") {
      return isWaitlistStatus(status);
    }

    return true;
  });

const createDateOptions = (params: {
  dates: readonly Date[];
  items: readonly BookingFeedItemDto[];
}): DateStripOption[] =>
  params.dates.map((date, index) => {
    const value = toDateKey(date);
    const count = params.items.filter((item) => item.date === value).length;

    return {
      count,
      dateLabel:
        index === 0 ? "오늘" : `${date.getMonth() + 1}/${date.getDate()}`,
      dayLabel: WEEKDAY_LABELS[date.getDay()],
      value,
    };
  });

const getReservationResultDescription = (item?: BookingFeedItemDto | null) => {
  if (!item) {
    return "홈 피드와 내 예약 목록을 새로고침했습니다.";
  }

  const status = toBookingStatus(item);
  if (status === "WAITLIST_OPEN") {
    return "대기 등록 요청이 완료되었습니다. 내 예약 탭에서 순번을 확인할 수 있습니다.";
  }

  return "예약 요청이 완료되었습니다. 내 예약 탭에서 상태를 확인할 수 있습니다.";
};

const getFeedStatus = (params: {
  isError: boolean;
  isLoading: boolean;
  itemCount: number;
}): ReservationHomeFeedStatus => {
  if (params.isLoading) {
    return "loading";
  }

  if (params.isError) {
    return "error";
  }

  if (params.itemCount === 0) {
    return "empty";
  }

  return "ready";
};

const HomeTabRoute = observer(() => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const bookingDates = createBookingDates();
  const firstBookingDate = bookingDates[0] ?? startOfLocalDay(new Date());
  const feedParams = createBookingFeedParams(bookingDates);
  const requestOptions = { baseURL: getCoreApiBaseUrl() };
  const [selectedDate, setSelectedDate] = useState(toDateKey(firstBookingDate));
  const [selectedFeedItem, setSelectedFeedItem] =
    useState<BookingFeedItemDto | null>(null);
  const [isPolicySheetOpen, setIsPolicySheetOpen] = useState(false);
  const [memo, setMemo] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState(createIdempotencyKey);
  const [selectedFilter, setSelectedFilter] =
    useState<BookingFeedFilter>("all");
  const [lastSubmittedFeedItem, setLastSubmittedFeedItem] =
    useState<BookingFeedItemDto | null>(null);
  const isSpaceSelectionPending = !mobileApiScopeStore.isSpaceSelectionResolved;
  const hasSelectedSpace = Boolean(mobileApiScopeStore.spaceId);
  const isSpaceUnavailable =
    mobileApiScopeStore.isSpaceSelectionResolved && !hasSelectedSpace;

  const bookingFeedQuery = useGetReservationBookingFeed(feedParams, {
    query: { enabled: hasSelectedSpace },
    request: requestOptions,
  });

  const createReservationMutation = useCreateReservation({
    mutation: {
      onSuccess: () => {
        setLastSubmittedFeedItem(selectedFeedItem);
        setSelectedFeedItem(null);
        setIsPolicySheetOpen(false);
        setMemo("");
        setIdempotencyKey(createIdempotencyKey());
        void queryClient.invalidateQueries({
          queryKey: getGetReservationBookingFeedQueryKey(feedParams),
        });
        void queryClient.invalidateQueries({
          queryKey: getGetMyReservationsQueryKey({ skip: 0, take: 20 }),
        });
      },
    },
    request: requestOptions,
  });

  const feedItems = bookingFeedQuery.data?.data ?? [];
  const selectedDateItems = getFeedItemsForDate(feedItems, selectedDate);
  const filteredFeedItems = getFilteredFeedItems({
    filter: selectedFilter,
    items: selectedDateItems,
  });
  const cardItems = filteredFeedItems.map(toBookingClassCardItem);
  const dateOptions = createDateOptions({
    dates: bookingDates,
    items: feedItems,
  });
  const selectedCardItem = selectedFeedItem
    ? toBookingClassCardItem(selectedFeedItem)
    : null;
  const reservedCount = feedItems.filter((item) => {
    const status = toBookingStatus(item);
    return status === "RESERVED" || status === "WAITLISTED";
  }).length;
  const feedStatus = getFeedStatus({
    isError: isSpaceUnavailable || bookingFeedQuery.isError,
    isLoading:
      isSpaceSelectionPending ||
      (hasSelectedSpace && bookingFeedQuery.isLoading),
    itemCount: cardItems.length,
  });

  function handleSelectDate(value: string) {
    setSelectedDate(value);
    setSelectedFilter("all");
    setLastSubmittedFeedItem(null);
  }

  function handlePressFilter(value: BookingFeedFilter) {
    setSelectedFilter(value);
  }

  function handlePressRetry() {
    void bookingFeedQuery.refetch();
  }

  function handlePressBookingCta(cardItem: BookingClassFeedItem) {
    const nextFeedItem = feedItems.find(
      (item) => item.feedItemId === cardItem.id,
    );
    if (!nextFeedItem) {
      return;
    }

    if (
      nextFeedItem.paymentRequired ??
      (!nextFeedItem.coursePassId &&
        isBookableStatus(toBookingStatus(nextFeedItem)))
    ) {
      router.push({
        pathname: "/payments/checkout",
        params: createCheckoutParams(nextFeedItem),
      } as unknown as Href);
      return;
    }

    setSelectedFeedItem(nextFeedItem);
    setIsPolicySheetOpen(true);
    setMemo("");
    setIdempotencyKey(createIdempotencyKey());
    createReservationMutation.reset();
  }

  function handleClosePolicySheet() {
    setIsPolicySheetOpen(false);
    setSelectedFeedItem(null);
    setMemo("");
    createReservationMutation.reset();
  }

  function handleChangeMemo(value: string) {
    setMemo(value);
  }

  function handleConfirmPolicySheet(
    _item: BookingClassFeedItem,
    nextMemo: string,
  ) {
    if (!selectedFeedItem?.coursePassId) {
      return;
    }

    createReservationMutation.mutate({
      data: {
        coursePassId: selectedFeedItem.coursePassId,
        idempotencyKey,
        memo: nextMemo.trim() || undefined,
        occurrenceStartAt: selectedFeedItem.startsAt,
        programId: selectedFeedItem.programId,
        sessionId: selectedFeedItem.sessionId,
        timelineId: selectedFeedItem.timelineId,
      },
    });
  }

  return (
    <ReservationHomeScreen
      bookingWindowDays={BOOKING_WINDOW_DAYS}
      cardItems={cardItems}
      dateOptions={dateOptions}
      feedErrorDescription={
        isSpaceUnavailable
          ? "예약 가능한 공간을 먼저 선택해 주세요."
          : bookingFeedQuery.isError
            ? getApiErrorDescription(bookingFeedQuery.error)
            : undefined
      }
      feedStatus={feedStatus}
      filterOptions={FILTER_OPTIONS}
      isFetching={
        hasSelectedSpace &&
        bookingFeedQuery.isFetching &&
        !bookingFeedQuery.isLoading
      }
      onPressBookingCta={handlePressBookingCta}
      onPressFilter={handlePressFilter}
      onPressRetry={handlePressRetry}
      onSelectDate={handleSelectDate}
      policySheet={{
        confirmLabel:
          selectedCardItem?.status === "WAITLIST_OPEN"
            ? "대기 등록"
            : "예약 확인",
        isLoading: createReservationMutation.isPending,
        isOpen: isPolicySheetOpen,
        item: selectedCardItem,
        memoValue: memo,
        onCancel: handleClosePolicySheet,
        onChangeMemo: handleChangeMemo,
        onConfirm: handleConfirmPolicySheet,
      }}
      reservationErrorDescription={
        createReservationMutation.isError
          ? getApiErrorDescription(createReservationMutation.error)
          : undefined
      }
      reservationSuccessDescription={
        createReservationMutation.isSuccess
          ? getReservationResultDescription(lastSubmittedFeedItem)
          : undefined
      }
      reservedCount={reservedCount}
      selectedDate={selectedDate}
      selectedDateLabel={formatReservationDate(`${selectedDate}T00:00:00`)}
      selectedFilter={selectedFilter}
    />
  );
});

export default HomeTabRoute;

import {
  MyReservationsScreen,
  type MyReservationCardItem,
  type MyReservationsScreenStatus,
} from "@cocrepo/mo-ui";
import { ApiClientError } from "@cocrepo/api/core/client";
import { useGetMyReservations } from "@cocrepo/api/core/reservations";
import type {
  ReservationDto,
  ReservationStatus,
} from "@cocrepo/api/core/model";
import { observer } from "mobx-react-lite";
import { formatDatabaseId } from "@cocrepo/type";
import { mobileApiScope } from "@/auth/mobile-api-scope";

const RESERVATION_QUERY_PARAMS = {
  skip: 0,
  take: 20,
};

const STATUS_LABELS: Record<ReservationStatus, string> = {
  CANCELED: "취소됨",
  CONFIRMED: "예약 확정",
  WAITLISTED: "대기중",
};

const pad2 = (value: number) => value.toString().padStart(2, "0");

const formatReservationDate = (date: Date) => {
  if (Number.isNaN(date.getTime())) {
    return "날짜 미정";
  }

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const formatReservationTime = (date: Date) => {
  if (Number.isNaN(date.getTime())) {
    return "시간 미정";
  }

  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
};

const getApiErrorDescription = (error: unknown) => {
  const status = (error as ApiClientError).status;

  switch (status) {
    case 401:
      return "로그인이 만료되었습니다. 다시 로그인한 뒤 확인해 주세요.";
    case 403:
      return "현재 공간에서 예약 목록을 볼 권한이 없습니다.";
    default:
      return "내 예약 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
  }
};

const getReservationTitle = (reservation: ReservationDto) =>
  reservation.program?.name ?? reservation.session?.name ?? "예약 수업";

const getReservationMeta = (reservation: ReservationDto) => {
  const parts = [
    formatReservationTime(reservation.occurrenceStartAt),
    reservation.timeline?.name,
    reservation.session?.name,
    reservation.waitlistPosition
      ? `대기 ${reservation.waitlistPosition}번`
      : undefined,
  ].filter(Boolean);

  return parts.join(" · ");
};

const toMyReservationCardItem = (
  reservation: ReservationDto,
): MyReservationCardItem => ({
  dateLabel: formatReservationDate(reservation.occurrenceStartAt),
  id: formatDatabaseId(reservation.id),
  memo: reservation.memo ?? undefined,
  metaLabel: getReservationMeta(reservation),
  statusLabel: STATUS_LABELS[reservation.status],
  title: getReservationTitle(reservation),
});

const getReservationsStatus = (params: {
  isError: boolean;
  isLoading: boolean;
  itemCount: number;
}): MyReservationsScreenStatus => {
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

const ReservationsTabRoute = observer(() => {
  const isSpaceSelectionPending = !mobileApiScope.isSpaceSelectionResolved;
  const hasSelectedSpace = Boolean(mobileApiScope.spaceId);
  const isSpaceUnavailable =
    mobileApiScope.isSpaceSelectionResolved && !hasSelectedSpace;
  const reservationsQuery = useGetMyReservations(RESERVATION_QUERY_PARAMS, {
    query: { enabled: hasSelectedSpace },
  });
  const reservations = reservationsQuery.data?.data ?? [];
  const items = reservations.map(toMyReservationCardItem);
  const status = getReservationsStatus({
    isError: isSpaceUnavailable || reservationsQuery.isError,
    isLoading:
      isSpaceSelectionPending ||
      (hasSelectedSpace && reservationsQuery.isLoading),
    itemCount: items.length,
  });

  function handlePressRetry() {
    void reservationsQuery.refetch();
  }

  return (
    <MyReservationsScreen
      errorDescription={
        isSpaceUnavailable
          ? "예약 목록을 볼 공간을 먼저 선택해 주세요."
          : reservationsQuery.isError
            ? getApiErrorDescription(reservationsQuery.error)
            : undefined
      }
      items={items}
      onPressRetry={handlePressRetry}
      status={status}
    />
  );
});

export default ReservationsTabRoute;

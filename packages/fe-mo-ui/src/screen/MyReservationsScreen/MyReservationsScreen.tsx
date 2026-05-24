import { type ReactNode } from "react";
import { ScrollView, View, type ViewProps } from "react-native";
import { Text } from "../../data-display/Text";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";
import { StatusFeedback } from "../../feedback/StatusFeedback";
import { Icon } from "../../icon";
import { ScreenFrame } from "../../layout/ScreenFrame";
export type MyReservationsScreenStatus =
  | "loading"
  | "error"
  | "empty"
  | "ready";
export interface MyReservationCardItem {
  dateLabel: ReactNode;
  id: string;
  memo?: ReactNode;
  metaLabel?: ReactNode;
  statusLabel: ReactNode;
  title: ReactNode;
}
export interface MyReservationsScreenProps extends Omit<ViewProps, "children"> {
  errorDescription?: ReactNode;
  items: readonly MyReservationCardItem[];
  onPressRetry?: () => void;
  status: MyReservationsScreenStatus;
}
export const MyReservationsScreen = observer(
  (props: MyReservationsScreenProps) => {
    const {
      errorDescription,
      items,
      onPressRetry,
      status,
      style,
      ...viewProps
    } = props;
    let reservationsContent: ReactNode;

    if (status === "loading") {
      reservationsContent = (
        <StatusFeedback
          description="예약과 대기 목록을 확인하고 있습니다."
          key="reservations-loading"
          status="loading"
          title="내 예약을 불러오는 중"
        />
      );
    } else if (status === "error") {
      reservationsContent = (
        <StatusFeedback
          description={errorDescription}
          key="reservations-error"
          onPressPrimaryAction={onPressRetry}
          primaryActionLabel="다시 시도"
          status="error"
          title="내 예약을 확인할 수 없습니다"
        />
      );
    } else if (status === "empty") {
      reservationsContent = (
        <StatusFeedback
          description="홈에서 수업을 선택하면 예약 또는 대기 항목이 이곳에 표시됩니다."
          key="reservations-empty"
          onPressPrimaryAction={onPressRetry}
          primaryActionLabel="목록 새로고침"
          status="empty"
          title="아직 예약이 없습니다"
        />
      );
    } else {
      const reservationCards: ReactNode[] = [];

      for (const item of items) {
        reservationCards.push(
          <View className={classNames.reservationCard()} key={item.id}>
            <View className={classNames.reservationHeader()} key="header">
              <View className={classNames.reservationDateRow()} key="date">
                <Icon name="calendarCheck" size="xs" tone="success" />
                <Text className={classNames.reservationDate()}>
                  {item.dateLabel}
                </Text>
              </View>
              <View className={classNames.statusBadge()} key="status">
                <Icon name="badgeCheck" size="xs" tone="warning" />
                <Text className={classNames.statusText()}>
                  {item.statusLabel}
                </Text>
              </View>
            </View>
            <Text className={classNames.reservationTitle()} key="title">
              {item.title}
            </Text>
            {item.metaLabel ? (
              <Text className={classNames.reservationMeta()} key="meta">
                {item.metaLabel}
              </Text>
            ) : null}
            {item.memo ? (
              <Text className={classNames.sectionDescription()} key="memo">
                {item.memo}
              </Text>
            ) : null}
          </View>,
        );
      }

      reservationsContent = reservationCards;
    }

    return (
      <ScreenFrame
        {...viewProps}
        className={classNames.screenFrame()}
        contentClassName={classNames.root()}
        edges={["right", "left"]}
        style={style}
      >
        <ScrollView
          contentContainerClassName={classNames.contentContainer()}
          showsVerticalScrollIndicator={false}
        >
          <View className={classNames.tabContent()}>
            <View className={classNames.sectionHeader()} key="header">
              <Text className={classNames.sectionTitle()} key="title">
                내 예약
              </Text>
              <Text
                className={classNames.sectionDescription()}
                key="description"
              >
                예약 확정과 대기 상태를 실제 Reservation API 기준으로
                확인합니다.
              </Text>
            </View>
            {reservationsContent}
          </View>
        </ScrollView>
      </ScreenFrame>
    );
  },
);
MyReservationsScreen.displayName = "MyReservationsScreen";
const myReservationsScreenClassNames = tv({
  slots: {
    contentContainer: "px-4 pb-8 pt-4",
    reservationCard: "gap-2 rounded-lg border border-border bg-surface p-4",
    reservationDate: "text-[13px] font-extrabold leading-5 text-success",
    reservationDateRow: "flex-row items-center gap-1.5",
    reservationHeader: "flex-row items-center justify-between",
    reservationMeta: "text-[13px] leading-5 text-surface-foreground",
    reservationTitle: "text-base font-extrabold leading-6 text-foreground",
    root: "flex-1 bg-background",
    screenFrame: "bg-background",
    sectionDescription: "text-[13px] leading-5 text-muted",
    sectionHeader: "gap-1",
    sectionTitle: "text-xl font-extrabold leading-7 text-foreground",
    statusBadge:
      "flex-row items-center gap-1 overflow-hidden rounded-full border border-warning bg-warning-soft px-2 py-1",
    statusText: "text-xs font-extrabold leading-4 text-warning-soft-foreground",
    tabContent: "gap-4",
  },
});
const classNames = myReservationsScreenClassNames();

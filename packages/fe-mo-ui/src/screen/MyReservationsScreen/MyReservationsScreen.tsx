import { type ReactNode } from "react";
import { ScrollView, Text, View, type ViewProps } from "react-native";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";
import { StatusFeedback } from "../../feedback/StatusFeedback";
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
              <Text className={classNames.reservationDate()} key="date">
                {item.dateLabel}
              </Text>
              <Text className={classNames.statusBadge()} key="status">
                {item.statusLabel}
              </Text>
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
    contentContainer: "px-5 pb-9 pt-5",
    reservationCard:
      "gap-2 rounded-2xl border border-border bg-surface p-4 shadow-surface",
    reservationDate: "text-[13px] font-bold text-success",
    reservationHeader: "flex-row items-center justify-between",
    reservationMeta: "text-sm text-surface-foreground",
    reservationTitle: "text-[17px] font-bold text-foreground",
    root: "flex-1 bg-background",
    screenFrame: "bg-background",
    sectionDescription: "text-sm leading-[21px] text-muted",
    sectionHeader: "gap-1.5",
    sectionTitle: "text-[22px] font-extrabold text-foreground",
    statusBadge:
      "overflow-hidden rounded-full bg-warning px-2.5 py-1 text-xs font-bold text-warning-foreground",
    tabContent: "gap-[18px]",
  },
});
const classNames = myReservationsScreenClassNames();

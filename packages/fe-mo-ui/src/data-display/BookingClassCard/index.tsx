import { type ReactNode } from "react";
import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type ViewProps,
} from "react-native";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";
export type BookingAvailabilityStatus =
  | "AVAILABLE"
  | "FEW_LEFT"
  | "WAITLIST_OPEN"
  | "RESERVED"
  | "WAITLISTED"
  | "BOOKING_CLOSED";
export interface BookingClassFeedItem {
  availableCount?: number;
  capacity?: number;
  coachName?: ReactNode;
  confirmedCount?: number;
  ctaLabel?: ReactNode;
  id: string;
  level?: ReactNode;
  myReservationStatus?: ReactNode;
  previewExerciseTags?: readonly ReactNode[];
  programName: ReactNode;
  routineLabel?: ReactNode;
  sessionName?: ReactNode;
  status: BookingAvailabilityStatus;
  statusLabel?: ReactNode;
  timeLabel: ReactNode;
  timelineName?: ReactNode;
  waitlistCount?: number;
}
export interface BookingClassCardProps extends Omit<ViewProps, "children"> {
  item: BookingClassFeedItem;
  onPressCta?: (item: BookingClassFeedItem) => void;
}
const STATUS_LABELS: Record<BookingAvailabilityStatus, string> = {
  AVAILABLE: "Available",
  BOOKING_CLOSED: "Closed",
  FEW_LEFT: "Few left",
  RESERVED: "Reserved",
  WAITLISTED: "Waitlisted",
  WAITLIST_OPEN: "Waitlist open",
};
const DEFAULT_CTA_LABELS: Record<BookingAvailabilityStatus, string> = {
  AVAILABLE: "Book",
  BOOKING_CLOSED: "Closed",
  FEW_LEFT: "Book",
  RESERVED: "Reserved",
  WAITLISTED: "Waitlisted",
  WAITLIST_OPEN: "Join waitlist",
};
const isActionDisabled = (item: BookingClassFeedItem, onPressCta?: unknown) =>
  !onPressCta ||
  item.status === "BOOKING_CLOSED" ||
  item.status === "RESERVED" ||
  item.status === "WAITLISTED";
const OptionalText = ({
  className,
  value,
}: {
  className: string;
  value: ReactNode;
}) => {
  if (value === undefined || value === null || value === false) {
    return null;
  }
  return <Text className={className}>{value}</Text>;
};
const CapacityText = ({ item }: { item: BookingClassFeedItem }) => {
  const parts = [
    item.availableCount === undefined
      ? undefined
      : `잔여 ${item.availableCount}석`,
    item.capacity === undefined && item.confirmedCount === undefined
      ? undefined
      : `예약 ${item.confirmedCount ?? 0}${item.capacity === undefined ? "" : `/${item.capacity}`}`,
    item.waitlistCount === undefined
      ? undefined
      : `대기 ${item.waitlistCount}명`,
  ].filter(Boolean);
  if (!parts.length) {
    return null;
  }
  return <Text className={classNames.capacityText()}>{parts.join(" · ")}</Text>;
};
const ExerciseTag = ({ tag }: { tag: ReactNode }) => (
  <View className={classNames.tag()}>
    <Text className={classNames.tagText()}>{tag}</Text>
  </View>
);
const ExerciseTags = ({ item }: { item: BookingClassFeedItem }) => {
  if (!item.previewExerciseTags?.length) {
    return null;
  }
  return (
    <View className={classNames.tags()}>
      {item.previewExerciseTags.map((tag, index) => (
        <ExerciseTag key={`exercise-tag-${index}`} tag={tag} />
      ))}
    </View>
  );
};
const BookingMeta = ({ item }: { item: BookingClassFeedItem }) => {
  const meta = [
    item.coachName ? (
      <Text className={classNames.metaText()}>Coach {item.coachName}</Text>
    ) : undefined,
    item.level,
    item.routineLabel,
  ].filter(Boolean);
  if (!meta.length) {
    return null;
  }
  return (
    <View className={classNames.meta()}>
      {meta.map((value, index) => (
        <Text
          key={`booking-class-meta-${index}`}
          className={classNames.metaText()}
        >
          {value}
        </Text>
      ))}
    </View>
  );
};
const createPressHandler = (
  item: BookingClassFeedItem,
  onPressCta: BookingClassCardProps["onPressCta"],
) => {
  if (isActionDisabled(item, onPressCta)) {
    return undefined;
  }
  return () => {
    onPressCta?.(item);
  };
};
const BookingClassCardComponent = observer((props: BookingClassCardProps) => {
  const { item, onPressCta, style, ...rest } = props;
  const ctaLabel = item.ctaLabel ?? DEFAULT_CTA_LABELS[item.status];
  const disabled = isActionDisabled(item, onPressCta);
  const slotClassNames = bookingClassCardClassNames({
    disabled,
    status: item.status,
  });
  return (
    <View {...rest} className={slotClassNames.root()} style={style}>
      <View className={slotClassNames.header()}>
        <View className={slotClassNames.timeBlock()} key="time">
          <Text className={slotClassNames.time()} key="time-label">
            {item.timeLabel}
          </Text>
        </View>
        <View className={slotClassNames.titleBlock()} key="titles">
          <View className={slotClassNames.titleRow()} key="title-row">
            <Text className={slotClassNames.program()} key="program">
              {item.programName}
            </Text>
            <View className={slotClassNames.statusBadge()} key="status">
              <Text className={slotClassNames.statusText()}>
                {item.statusLabel ?? STATUS_LABELS[item.status]}
              </Text>
            </View>
          </View>
          <OptionalText
            className={slotClassNames.session()}
            value={item.sessionName}
          />
          <OptionalText
            className={slotClassNames.timeline()}
            value={item.timelineName}
          />
        </View>
      </View>
      <BookingMeta item={item} />
      <CapacityText item={item} />
      <ExerciseTags item={item} />
      {item.myReservationStatus ? (
        <Text className={slotClassNames.myStatus()}>
          {item.myReservationStatus}
        </Text>
      ) : null}
      <Pressable
        accessibilityLabel={
          typeof ctaLabel === "string" ? ctaLabel : `Action for ${item.id}`
        }
        accessibilityRole="button"
        accessibilityState={{
          disabled,
        }}
        disabled={disabled}
        onPress={
          createPressHandler(item, onPressCta) as PressableProps["onPress"]
        }
        className={slotClassNames.action()}
      >
        <Text className={slotClassNames.actionText()}>{ctaLabel}</Text>
      </Pressable>
    </View>
  );
});
BookingClassCardComponent.displayName = "BookingClassCard";
export const BookingClassCard = BookingClassCardComponent;
const bookingClassCardClassNames = tv({
  slots: {
    action:
      "min-h-[46px] items-center justify-center rounded-xl bg-accent px-4 py-3",
    actionText: "text-[15px] font-extrabold leading-5 text-accent-foreground",
    capacityText:
      "rounded-xl bg-surface-secondary px-3 py-2 text-[13px] font-bold leading-[18px] text-surface-secondary-foreground",
    header: "flex-row items-stretch gap-3",
    meta: "flex-row flex-wrap gap-2",
    metaText: "text-[13px] leading-[18px] text-muted",
    myStatus: "text-[13px] font-bold leading-[18px] text-success",
    program: "flex-1 text-[17px] font-extrabold leading-[23px] text-foreground",
    root: "gap-3 rounded-[14px] border border-border bg-surface p-4 shadow-surface",
    session: "text-sm font-bold leading-5 text-surface-foreground",
    statusBadge:
      "items-center self-start rounded-full bg-surface-secondary px-[9px] py-[5px]",
    statusText:
      "text-[11px] font-extrabold leading-[14px] text-surface-secondary-foreground",
    tag: "rounded-full bg-surface-secondary px-2.5 py-[5px]",
    tagText: "text-xs font-bold leading-4 text-surface-secondary-foreground",
    tags: "flex-row flex-wrap gap-2",
    time: "text-center text-[16px] font-black leading-6 text-foreground",
    timeBlock:
      "min-w-[86px] items-center justify-center rounded-xl bg-surface-secondary px-3 py-3",
    timeline: "text-[13px] leading-[18px] text-muted",
    titleBlock: "flex-1 gap-1",
    titleRow: "flex-row items-start gap-2",
  },
  variants: {
    disabled: {
      false: {},
      true: {
        action: "bg-surface-secondary opacity-75",
        actionText: "text-surface-secondary-foreground",
      },
    },
    status: {
      AVAILABLE: {},
      BOOKING_CLOSED: {
        statusBadge: "bg-default",
      },
      FEW_LEFT: {
        statusBadge: "bg-warning",
        statusText: "text-warning-foreground",
      },
      RESERVED: {
        statusBadge: "bg-success",
        statusText: "text-success-foreground",
      },
      WAITLISTED: {
        statusBadge: "bg-success",
        statusText: "text-success-foreground",
      },
      WAITLIST_OPEN: {
        statusBadge: "bg-accent",
        statusText: "text-accent-foreground",
      },
    },
  },
});
const classNames = bookingClassCardClassNames();

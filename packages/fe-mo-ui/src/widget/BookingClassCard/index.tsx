import { type ReactNode } from "react";
import {
  Pressable,
  View,
  type PressableProps,
  type ViewProps,
} from "react-native";
import { Text } from "../../data-display/Text";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";
import { Icon, type MobileIconName } from "../../icon";
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
const STATUS_ICONS: Record<BookingAvailabilityStatus, MobileIconName> = {
  AVAILABLE: "circleCheck",
  BOOKING_CLOSED: "circleSlash",
  FEW_LEFT: "triangleAlert",
  RESERVED: "ticketCheck",
  WAITLISTED: "hourglass",
  WAITLIST_OPEN: "hourglass",
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
const getPrimitiveNodeKey = (node: ReactNode) => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  return undefined;
};
const getDisplayNodeKey = (
  scope: string,
  ownerId: string,
  node: ReactNode,
  position: number,
) => {
  const primitiveKey = getPrimitiveNodeKey(node);
  if (primitiveKey) {
    return `${scope}-${ownerId}-${primitiveKey}`;
  }
  return `${scope}-${ownerId}-position-${position}`;
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
  return (
    <View className={classNames.capacityRow()}>
      <Icon name="users" size="xs" tone="muted" />
      <Text className={classNames.capacityText()}>{parts.join(" · ")}</Text>
    </View>
  );
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
      {item.previewExerciseTags.map((tag, index) => {
        const tagKey = getDisplayNodeKey("exercise-tag", item.id, tag, index);
        return <ExerciseTag key={tagKey} tag={tag} />;
      })}
    </View>
  );
};
interface BookingMetaEntry {
  key: string;
  value: ReactNode;
}
const isBookingMetaEntry = (
  entry: BookingMetaEntry | undefined,
): entry is BookingMetaEntry => entry !== undefined;
const BookingMeta = ({ item }: { item: BookingClassFeedItem }) => {
  const metaCandidates: Array<BookingMetaEntry | undefined> = [
    item.coachName
      ? {
          key: "coach",
          value: <>Coach {item.coachName}</>,
        }
      : undefined,
    item.level
      ? {
          key: "level",
          value: item.level,
        }
      : undefined,
    item.routineLabel
      ? {
          key: "routine",
          value: item.routineLabel,
        }
      : undefined,
  ];
  const meta = metaCandidates.filter(isBookingMetaEntry);
  if (!meta.length) {
    return null;
  }
  return (
    <View className={classNames.meta()}>
      {meta.map(({ key, value }) => (
        <Text key={key} className={classNames.metaText()}>
          {value}
        </Text>
      ))}
    </View>
  );
};
const TimelineText = ({ value }: { value?: ReactNode }) => {
  if (value === undefined || value === null || value === false) {
    return null;
  }
  return (
    <View className={classNames.timelineRow()}>
      <Icon name="mapPin" size="xs" tone="muted" />
      <Text className={classNames.timeline()}>{value}</Text>
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
          <Icon name="clock" size="sm" tone="muted" />
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
              <Icon
                name={STATUS_ICONS[item.status]}
                size="xs"
                tone={
                  item.status === "AVAILABLE" ||
                  item.status === "RESERVED" ||
                  item.status === "WAITLISTED"
                    ? "success"
                    : item.status === "FEW_LEFT"
                      ? "warning"
                      : item.status === "WAITLIST_OPEN"
                        ? "accent"
                        : "muted"
                }
              />
              <Text className={slotClassNames.statusText()}>
                {item.statusLabel ?? STATUS_LABELS[item.status]}
              </Text>
            </View>
          </View>
          <OptionalText
            className={slotClassNames.session()}
            value={item.sessionName}
          />
          <TimelineText value={item.timelineName} />
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
        <Icon
          name="arrowRight"
          size="sm"
          tone={disabled ? "muted" : "accentForeground"}
        />
      </Pressable>
    </View>
  );
});
BookingClassCardComponent.displayName = "BookingClassCard";
export const BookingClassCard = BookingClassCardComponent;
const bookingClassCardClassNames = tv({
  slots: {
    action:
      "min-h-11 flex-row items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5",
    actionText: "text-sm font-extrabold leading-5 text-accent-foreground",
    capacityRow:
      "flex-row items-center gap-2 rounded-lg border border-border bg-surface-secondary px-3 py-2",
    capacityText:
      "flex-1 text-[13px] font-bold leading-[18px] text-surface-secondary-foreground",
    header: "flex-row items-stretch gap-2",
    meta: "flex-row flex-wrap gap-2",
    metaText: "text-[13px] leading-[18px] text-muted",
    myStatus: "text-[13px] font-bold leading-[18px] text-success",
    program: "flex-1 text-base font-extrabold leading-6 text-foreground",
    root: "gap-3 rounded-lg border border-border bg-surface p-4",
    session: "text-sm font-bold leading-5 text-surface-foreground",
    statusBadge:
      "flex-row items-center gap-1 self-start rounded-full border border-border bg-surface-secondary px-2 py-1",
    statusText:
      "text-[11px] font-extrabold leading-[14px] text-surface-secondary-foreground",
    tag: "rounded-full border border-border bg-surface-secondary px-2 py-1",
    tagText: "text-xs font-bold leading-4 text-surface-secondary-foreground",
    tags: "flex-row flex-wrap gap-2",
    time: "text-center text-[15px] font-black leading-6 text-foreground",
    timeBlock:
      "min-w-20 items-center justify-center gap-1 rounded-lg border border-border bg-surface-secondary px-2 py-2",
    timeline: "text-[13px] leading-[18px] text-muted",
    timelineRow: "flex-row items-center gap-1.5",
    titleBlock: "flex-1 gap-1",
    titleRow: "flex-row items-start gap-2",
  },
  variants: {
    disabled: {
      false: {},
      true: {
        action: "border border-border bg-surface-secondary opacity-75",
        actionText: "text-surface-secondary-foreground",
      },
    },
    status: {
      AVAILABLE: {},
      BOOKING_CLOSED: {
        statusBadge: "bg-default",
      },
      FEW_LEFT: {
        statusBadge: "border-warning bg-warning-soft",
        statusText: "text-warning-soft-foreground",
      },
      RESERVED: {
        statusBadge: "border-success bg-success-soft",
        statusText: "text-success-soft-foreground",
      },
      WAITLISTED: {
        statusBadge: "border-success bg-success-soft",
        statusText: "text-success-soft-foreground",
      },
      WAITLIST_OPEN: {
        statusBadge: "border-accent bg-accent-soft",
        statusText: "text-accent-soft-foreground",
      },
    },
  },
});
const classNames = bookingClassCardClassNames();

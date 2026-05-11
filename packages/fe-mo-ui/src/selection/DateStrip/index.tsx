import { type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";
export interface DateStripOption {
  badge?: ReactNode;
  count?: number;
  dateLabel: ReactNode;
  dayLabel: ReactNode;
  isDisabled?: boolean;
  value: string;
}
export interface DateStripProps extends Omit<ViewProps, "children"> {
  contentContainerClassName?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  emptyLabel?: ReactNode;
  onSelect?: (value: string, option: DateStripOption) => void;
  options?: readonly DateStripOption[];
  selectedValue?: string | null;
}
const toText = (value: ReactNode) => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  return undefined;
};
const getAccessibilityLabel = (option: DateStripOption) =>
  [toText(option.dayLabel), toText(option.dateLabel)].filter(Boolean).join(" ");
const createSelectHandler = (
  option: DateStripOption,
  disabled: boolean,
  onSelect: DateStripProps["onSelect"],
) => {
  if (disabled || option.isDisabled) {
    return undefined;
  }
  return () => {
    onSelect?.(option.value, option);
  };
};
const DateBadge = ({
  isSelected,
  option,
}: {
  isSelected: boolean;
  option: DateStripOption;
}) => {
  const badge = option.badge ?? option.count;
  const slotClassNames = dateStripClassNames({
    selected: isSelected,
  });
  if (badge === undefined || badge === null || badge === false) {
    return null;
  }
  return (
    <View className={slotClassNames.badge()}>
      <Text className={slotClassNames.badgeText()}>{badge}</Text>
    </View>
  );
};
const DateOption = ({
  disabled,
  index,
  onSelect,
  option,
  selectedValue,
}: Pick<DateStripProps, "disabled" | "onSelect" | "selectedValue"> & {
  index: number;
  option: DateStripOption;
}) => {
  const isSelected = selectedValue === option.value;
  const isDisabled = Boolean(disabled || option.isDisabled);
  const slotClassNames = dateStripClassNames({
    disabled: isDisabled,
    selected: isSelected,
  });
  return (
    <Pressable
      accessibilityLabel={getAccessibilityLabel(option)}
      accessibilityRole="button"
      accessibilityState={{
        disabled: isDisabled,
        selected: isSelected,
      }}
      disabled={isDisabled}
      key={option.value || `date-strip-option-${index}`}
      onPress={
        createSelectHandler(
          option,
          Boolean(disabled),
          onSelect,
        ) as PressableProps["onPress"]
      }
      className={slotClassNames.option()}
    >
      <Text className={slotClassNames.dayLabel()}>{option.dayLabel}</Text>
      <Text className={slotClassNames.dateLabel()}>{option.dateLabel}</Text>
      <DateBadge isSelected={isSelected} option={option} />
    </Pressable>
  );
};
const DateOptions = ({
  disabled,
  onSelect,
  options = [],
  selectedValue,
}: Pick<
  DateStripProps,
  "disabled" | "onSelect" | "options" | "selectedValue"
>) => (
  <>
    {options.map((option, index) => (
      <DateOption
        disabled={disabled}
        index={index}
        key={option.value || `date-strip-option-${index}`}
        onSelect={onSelect}
        option={option}
        selectedValue={selectedValue}
      />
    ))}
  </>
);
const DateStripComponent = observer((props: DateStripProps) => {
  const {
    className,
    contentContainerClassName,
    contentContainerStyle,
    disabled = false,
    emptyLabel,
    options = [],
    onSelect,
    selectedValue,
    style,
    ...rest
  } = props;
  if (!options.length) {
    return (
      <View
        {...rest}
        accessibilityRole="summary"
        className={classNames.empty()}
        style={style}
      >
        <Text className={classNames.emptyText()}>
          {emptyLabel ?? "No dates"}
        </Text>
      </View>
    );
  }
  return (
    <View {...rest} className={className} style={style}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName={classNames.content({
          className: contentContainerClassName,
        })}
        contentContainerStyle={contentContainerStyle}
      >
        <DateOptions
          disabled={disabled}
          onSelect={onSelect}
          options={options}
          selectedValue={selectedValue}
        />
      </ScrollView>
    </View>
  );
});
DateStripComponent.displayName = "DateStrip";
export const DateStrip = DateStripComponent;
const dateStripClassNames = tv({
  slots: {
    badge:
      "min-w-6 items-center rounded-full bg-surface-secondary px-[7px] py-[3px]",
    badgeText:
      "text-[11px] font-extrabold leading-[14px] text-surface-secondary-foreground",
    content: "gap-2 px-0.5 py-0.5",
    dateLabel: "text-lg font-extrabold leading-[22px] text-foreground",
    dayLabel: "text-xs font-bold uppercase leading-4 text-muted",
    empty: "rounded-xl border border-border bg-surface-secondary p-4",
    emptyText: "text-sm leading-5 text-muted",
    option:
      "min-h-[92px] min-w-[72px] items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-2.5 py-3 shadow-surface",
  },
  variants: {
    disabled: {
      false: {},
      true: {
        option: "opacity-[0.45]",
      },
    },
    selected: {
      false: {},
      true: {
        badge: "bg-accent-foreground",
        badgeText: "text-accent",
        dateLabel: "text-accent-foreground",
        dayLabel: "text-accent-foreground",
        option: "border-2 border-accent bg-accent",
      },
    },
  },
  defaultVariants: {
    disabled: false,
    selected: false,
  },
});
const classNames = dateStripClassNames();

import { type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";
import { Text } from "../../data-display/Text";
import {
  SelectableCardList,
  type SelectableCardItem,
} from "../../selection/SelectableCardList";
export type OccurrencePickerSessionType =
  | "ONE_TIME"
  | "ONE_TIME_RANGE"
  | "RECURRING";
export interface OccurrenceOption {
  description?: ReactNode;
  isDisabled?: boolean;
  label: ReactNode;
  unavailableReason?: ReactNode;
  value: string;
}
export interface OccurrencePickerProps extends Omit<ViewProps, "children"> {
  description?: ReactNode;
  disabled?: boolean;
  emptyMessage?: ReactNode;
  errorMessage?: ReactNode;
  fixedDescription?: ReactNode;
  fixedLabel?: ReactNode;
  fixedValue?: string;
  onChange?: (value: string) => void;
  options?: readonly OccurrenceOption[];
  recurringUnavailableMessage?: ReactNode;
  selectedValue?: string | null;
  sessionType: OccurrencePickerSessionType;
  title?: ReactNode;
}
const SESSION_TYPE_LABELS: Record<OccurrencePickerSessionType, string> = {
  ONE_TIME: "Fixed time",
  ONE_TIME_RANGE: "Choose a time",
  RECURRING: "Choose an occurrence",
};
const toSelectableCardItem = (
  option: OccurrenceOption,
): SelectableCardItem => ({
  description: option.description,
  disabledReason: option.unavailableReason,
  isDisabled: option.isDisabled,
  title: option.label,
  value: option.value,
});
const toSelectableCardItems = (options: readonly OccurrenceOption[]) =>
  options.map(toSelectableCardItem);
const createFixedOption = (
  props: OccurrencePickerProps,
): SelectableCardItem[] => {
  if (!props.fixedValue) {
    return [];
  }
  return [
    {
      description: props.fixedDescription,
      title: props.fixedLabel ?? props.fixedValue,
      value: props.fixedValue,
    },
  ];
};
const getOccurrenceItems = (props: OccurrencePickerProps) => {
  if (props.sessionType === "ONE_TIME") {
    return createFixedOption(props);
  }
  return toSelectableCardItems(props.options ?? []);
};
const getEmptyMessage = (props: OccurrencePickerProps) => {
  if (props.emptyMessage) {
    return props.emptyMessage;
  }
  if (props.sessionType === "RECURRING") {
    return (
      props.recurringUnavailableMessage ??
      "Recurring occurrence options need a backend occurrence read model."
    );
  }
  if (props.sessionType === "ONE_TIME") {
    return "This session does not have a fixed reservation time.";
  }
  return "No occurrence options are available.";
};
const EmptyMessage = (props: OccurrencePickerProps) => (
  <View accessibilityRole="summary" className={classNames.empty()}>
    <Text className={classNames.emptyText()}>{getEmptyMessage(props)}</Text>
  </View>
);
const ErrorMessage = ({ errorMessage }: { errorMessage?: ReactNode }) => {
  if (!errorMessage) {
    return null;
  }
  return (
    <Text accessibilityRole="alert" className={classNames.errorText()}>
      {errorMessage}
    </Text>
  );
};
const OccurrencePickerComponent = observer((props: OccurrencePickerProps) => {
  const {
    description,
    disabled = false,
    emptyMessage,
    errorMessage,
    fixedDescription,
    fixedLabel,
    fixedValue,
    onChange,
    options,
    recurringUnavailableMessage,
    selectedValue,
    sessionType,
    style,
    title,
    ...viewProps
  } = props;
  const listProps: OccurrencePickerProps = {
    description,
    disabled,
    emptyMessage,
    errorMessage,
    fixedDescription,
    fixedLabel,
    fixedValue,
    onChange,
    options,
    recurringUnavailableMessage,
    selectedValue,
    sessionType,
    title,
  };
  const items = getOccurrenceItems(listProps);
  const currentValue =
    selectedValue ?? (sessionType === "ONE_TIME" ? listProps.fixedValue : null);
  return (
    <View {...viewProps} className={classNames.root()} style={style}>
      <SelectableCardList
        description={description}
        disabled={disabled}
        emptyContent={<EmptyMessage {...listProps} />}
        items={items}
        onSelect={onChange}
        selectedValue={currentValue}
        title={title ?? SESSION_TYPE_LABELS[sessionType]}
      />
      <ErrorMessage errorMessage={errorMessage} />
    </View>
  );
});
OccurrencePickerComponent.displayName = "OccurrencePicker";
export const OccurrencePicker = OccurrencePickerComponent;
const occurrencePickerClassNames = tv({
  slots: {
    empty: "rounded-lg border border-border bg-surface p-4",
    emptyText: "text-sm leading-5 text-muted",
    errorText: "text-[13px] leading-[18px] text-danger",
    root: "gap-2",
  },
});
const classNames = occurrencePickerClassNames();

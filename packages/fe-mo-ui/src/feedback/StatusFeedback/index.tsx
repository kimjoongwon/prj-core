import { type ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";
import { Button } from "../../action/Button";
import { Card } from "../../layout/Card";
export type StatusFeedbackStatus =
  | "idle"
  | "loading"
  | "empty"
  | "error"
  | "submitting"
  | "success";
export interface StatusFeedbackProps extends Omit<ViewProps, "children"> {
  description?: ReactNode;
  primaryActionLabel?: string;
  onPressPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onPressSecondaryAction?: () => void;
  status?: StatusFeedbackStatus;
  title: ReactNode;
}
const STATUS_LABELS: Record<StatusFeedbackStatus, string> = {
  empty: "Empty",
  error: "Needs attention",
  idle: "Status",
  loading: "Loading",
  submitting: "Submitting",
  success: "Success",
};
const FeedbackDescription = ({ description }: { description?: ReactNode }) => {
  if (!description) {
    return null;
  }
  return <Text className={classNames.description()}>{description}</Text>;
};
const FeedbackAction = ({
  label,
  onPress,
  variant,
}: {
  label?: string;
  onPress?: () => void;
  variant: "primary" | "secondary";
}) => {
  if (!label) {
    return null;
  }
  const actionClassNames = statusFeedbackClassNames({
    actionVariant: variant,
  });
  return (
    <Button
      accessibilityLabel={label}
      className={actionClassNames.action()}
      isDisabled={!onPress}
      onPress={onPress}
      size="sm"
      variant={variant === "primary" ? "primary" : "secondary"}
    >
      {label}
    </Button>
  );
};
const FeedbackActions = ({
  onPressPrimaryAction,
  onPressSecondaryAction,
  primaryActionLabel,
  secondaryActionLabel,
}: Pick<
  StatusFeedbackProps,
  | "onPressPrimaryAction"
  | "onPressSecondaryAction"
  | "primaryActionLabel"
  | "secondaryActionLabel"
>) => {
  if (!primaryActionLabel && !secondaryActionLabel) {
    return null;
  }
  return (
    <View className={classNames.actions()}>
      <FeedbackAction
        label={primaryActionLabel}
        onPress={onPressPrimaryAction}
        variant="primary"
      />
      <FeedbackAction
        label={secondaryActionLabel}
        onPress={onPressSecondaryAction}
        variant="secondary"
      />
    </View>
  );
};
const StatusFeedbackComponent = observer((props: StatusFeedbackProps) => {
  const {
    description,
    primaryActionLabel,
    onPressPrimaryAction,
    secondaryActionLabel,
    onPressSecondaryAction,
    status = "idle",
    style,
    title,
    ...rest
  } = props;
  const isBusy = status === "loading" || status === "submitting";
  const slotClassNames = statusFeedbackClassNames({
    status,
  });
  return (
    <Card
      {...rest}
      accessibilityRole={status === "error" ? "alert" : "summary"}
      accessibilityState={{
        busy: isBusy,
      }}
      className={slotClassNames.root()}
      style={style}
    >
      <View className={slotClassNames.header()}>
        <View className={slotClassNames.badge()} key="badge">
          <Text className={slotClassNames.badgeText()}>
            {STATUS_LABELS[status]}
          </Text>
        </View>
        <Text className={slotClassNames.title()} key="title">
          {title}
        </Text>
      </View>
      <FeedbackDescription description={description} />
      <FeedbackActions
        onPressPrimaryAction={onPressPrimaryAction}
        onPressSecondaryAction={onPressSecondaryAction}
        primaryActionLabel={primaryActionLabel}
        secondaryActionLabel={secondaryActionLabel}
      />
    </Card>
  );
});
StatusFeedbackComponent.displayName = "StatusFeedback";
export const StatusFeedback = StatusFeedbackComponent;
const statusFeedbackClassNames = tv({
  slots: {
    action: "",
    actions: "flex-row flex-wrap gap-2.5",
    badge: "self-start rounded-full px-2.5 py-[5px]",
    badgeText: "text-xs font-bold leading-4 text-foreground",
    description: "text-sm leading-5 text-muted",
    header: "gap-2.5",
    root: "gap-3 border",
    title: "text-[17px] font-extrabold leading-[23px] text-foreground",
  },
  variants: {
    actionVariant: {
      primary: {},
      secondary: {},
    },
    status: {
      empty: {
        badge: "bg-default",
        root: "border-border",
      },
      error: {
        badge: "bg-danger",
        badgeText: "text-danger-foreground",
        root: "border-danger",
      },
      idle: {
        badge: "bg-surface-secondary",
        root: "border-border",
      },
      loading: {
        badge: "bg-accent",
        badgeText: "text-accent-foreground",
        root: "border-accent",
      },
      submitting: {
        badge: "bg-warning",
        badgeText: "text-warning-foreground",
        root: "border-warning",
      },
      success: {
        badge: "bg-success",
        badgeText: "text-success-foreground",
        root: "border-success",
      },
    },
  },
  defaultVariants: {
    actionVariant: "primary",
    status: "idle",
  },
});
const classNames = statusFeedbackClassNames();

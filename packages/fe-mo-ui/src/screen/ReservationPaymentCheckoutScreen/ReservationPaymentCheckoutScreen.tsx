import { type ReactNode } from "react";
import { ScrollView, View, type ViewProps } from "react-native";
import { Text } from "../../data-display/Text";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";
import { Button } from "../../action/Button";
import {
  ReservationCheckoutSummary,
  type ReservationCheckoutSummaryItem,
} from "../../data-display/ReservationCheckoutSummary";
import { StatusFeedback } from "../../feedback/StatusFeedback";
import { Icon } from "../../icon";
import { Card } from "../../layout/Card";
import { ScreenFrame } from "../../layout/ScreenFrame";
import { SelectableCardList } from "../../selection/SelectableCardList";
export type ReservationPaymentCheckoutStatus =
  | "idle"
  | "loading"
  | "submitting"
  | "success"
  | "error";
export type ReservationCheckoutProgressStatus =
  | "COMPLETED"
  | "CURRENT"
  | "PENDING";
export interface ReservationPaymentCourseOption {
  description?: ReactNode;
  id: string;
  meta?: readonly ReactNode[];
  priceLabel?: ReactNode;
  title: ReactNode;
}
export interface ReservationPaymentMethodOption {
  description?: ReactNode;
  label: ReactNode;
  value: string;
}
export interface ReservationPaymentProgressStep {
  id: string;
  label: ReactNode;
  status: ReservationCheckoutProgressStatus;
}
export interface ReservationPaymentCheckoutScreenProps extends Omit<
  ViewProps,
  "children"
> {
  amountLabel?: ReactNode;
  courseOptions: readonly ReservationPaymentCourseOption[];
  currencyLabel?: ReactNode;
  errorDescription?: ReactNode;
  isSubmitDisabled?: boolean;
  methodOptions: readonly ReservationPaymentMethodOption[];
  onPressReservations?: () => void;
  onPressSubmit?: () => void;
  onSelectCourseOption?: (courseOfferingId: string) => void;
  onSelectPaymentMethod?: (paymentMethod: string) => void;
  progressSteps?: readonly ReservationPaymentProgressStep[];
  selectedCourseOfferingId?: string | null;
  selectedPaymentMethod?: string | null;
  status: ReservationPaymentCheckoutStatus;
  submitLabel?: string;
  summaryItems: readonly ReservationCheckoutSummaryItem[];
}
const toCourseCardItems = (
  options: readonly ReservationPaymentCourseOption[],
) =>
  options.map((option) => ({
    description: option.description,
    eyebrow: option.priceLabel,
    iconName: "walletCards" as const,
    meta: option.meta,
    title: option.title,
    value: option.id,
  }));
const toPaymentMethodCardItems = (
  options: readonly ReservationPaymentMethodOption[],
) =>
  options.map((option) => ({
    description: option.description,
    iconName: "creditCard" as const,
    title: option.label,
    value: option.value,
  }));
export const ReservationPaymentCheckoutScreen = observer(
  (props: ReservationPaymentCheckoutScreenProps) => {
    const {
      amountLabel,
      courseOptions,
      currencyLabel,
      errorDescription,
      isSubmitDisabled,
      methodOptions,
      onPressReservations,
      onPressSubmit,
      onSelectCourseOption,
      onSelectPaymentMethod,
      progressSteps,
      selectedCourseOfferingId,
      selectedPaymentMethod,
      status,
      style,
      submitLabel,
      summaryItems,
      ...viewProps
    } = props;
    const submitDisabled = isSubmitDisabled || status === "submitting";

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
          <View className={classNames.content()}>
            <Card className={classNames.header()} key="header">
              <View className={classNames.headerTop()} key="eyebrow">
                <Icon name="receipt" size="sm" tone="accent" />
                <Text className={classNames.eyebrow()}>
                  RESERVATION CHECKOUT
                </Text>
              </View>
              <Card.Title className={classNames.title()} key="title">
                결제 후 예약
              </Card.Title>
              <Card.Description
                className={classNames.description()}
                key="description"
              >
                선택한 수업에 필요한 과정을 결제하고 바로 예약을 확정합니다.
              </Card.Description>
            </Card>
            <ReservationCheckoutSummary
              amountLabel={amountLabel}
              currencyLabel={currencyLabel}
              items={summaryItems}
              key="summary"
              title="예약하려는 수업"
            />
            <SelectableCardList
              description="이 수업 예약에 사용할 수강권을 선택하세요."
              items={toCourseCardItems(courseOptions)}
              key="course-options"
              onSelect={onSelectCourseOption}
              selectLabel="선택"
              selectedLabel="선택됨"
              selectedValue={selectedCourseOfferingId}
              title="과정 선택"
            />
            <SelectableCardList
              description="실제 PG가 연결되기 전까지 선택값은 placeholder 승인에 사용됩니다."
              items={toPaymentMethodCardItems(methodOptions)}
              key="payment-methods"
              onSelect={onSelectPaymentMethod}
              selectLabel="선택"
              selectedLabel="선택됨"
              selectedValue={selectedPaymentMethod}
              title="결제 방법"
            />
            {progressSteps?.length ? (
              <Card className={classNames.progressBox()} key="progress">
                <Card.Title className={classNames.sectionTitle()} key="title">
                  진행 상태
                </Card.Title>
                <View className={classNames.progressList()} key="list">
                  {progressSteps.map((step, index) => {
                    const progressClassNames =
                      reservationPaymentCheckoutScreenClassNames({
                        progressStatus: step.status,
                      });

                    return (
                      <View
                        className={progressClassNames.progressStep()}
                        key={step.id || `progress-step-${index}`}
                      >
                        <View
                          className={progressClassNames.progressMark()}
                          key="mark"
                        >
                          <Icon
                            name={
                              step.status === "COMPLETED"
                                ? "circleCheck"
                                : step.status === "CURRENT"
                                  ? "hourglass"
                                  : "circle"
                            }
                            size="sm"
                            tone={
                              step.status === "COMPLETED"
                                ? "success"
                                : step.status === "CURRENT"
                                  ? "warning"
                                  : "muted"
                            }
                          />
                        </View>
                        <Text
                          className={progressClassNames.progressLabel()}
                          key="label"
                        >
                          {step.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </Card>
            ) : null}
            {status === "loading" ? (
              <StatusFeedback
                description="예약 가능한 과정과 결제 방법을 확인하고 있습니다."
                key="checkout-loading"
                status="loading"
                title="결제 정보를 불러오는 중"
              />
            ) : null}
            {status === "submitting" ? (
              <StatusFeedback
                description="결제 승인, 수강권 활성화, 예약 확정을 순서대로 처리하고 있습니다."
                key="checkout-submitting"
                status="submitting"
                title="결제를 진행하는 중"
              />
            ) : null}
            {status === "error" ? (
              <StatusFeedback
                description={errorDescription}
                key="checkout-error"
                onPressPrimaryAction={onPressSubmit}
                primaryActionLabel="다시 시도"
                status="error"
                title="결제를 진행할 수 없습니다"
              />
            ) : null}
            {status === "success" ? (
              <StatusFeedback
                description="수강권이 활성화되었고 선택한 수업 예약이 완료되었습니다."
                key="checkout-success"
                onPressPrimaryAction={onPressReservations}
                primaryActionLabel="예약 내역 보기"
                status="success"
                title="결제와 예약이 완료되었습니다"
              />
            ) : null}
            {status === "idle" ? (
              <StatusFeedback
                description="결제 제공자가 정해지기 전까지는 provider-neutral 방식으로 승인된 것처럼 처리합니다."
                key="checkout-idle"
                status="idle"
                title="예약 결제 전 확인"
              />
            ) : null}
            <Button
              accessibilityLabel="create-reservation-checkout"
              accessibilityState={{
                disabled: submitDisabled,
              }}
              className={classNames.submitAction()}
              isDisabled={submitDisabled}
              key="submit-action"
              onPress={onPressSubmit}
              size="lg"
              variant="primary"
            >
              {submitLabel ?? "결제하고 예약하기"}
            </Button>
          </View>
        </ScrollView>
      </ScreenFrame>
    );
  },
);
ReservationPaymentCheckoutScreen.displayName =
  "ReservationPaymentCheckoutScreen";
const reservationPaymentCheckoutScreenClassNames = tv({
  slots: {
    content: "gap-4",
    contentContainer: "px-4 pb-8 pt-4",
    description: "text-[13px] leading-5 text-muted",
    eyebrow: "text-xs font-extrabold tracking-[0px] text-accent",
    header: "gap-2 rounded-lg border border-border bg-surface p-4",
    headerTop: "flex-row items-center gap-2",
    progressBox: "gap-3 rounded-lg border border-border bg-surface p-4",
    progressLabel:
      "flex-1 text-[13px] font-bold leading-5 text-surface-foreground",
    progressList: "gap-2",
    progressMark: "w-6 items-center justify-center",
    progressStep: "flex-row items-center gap-2",
    root: "flex-1 bg-background",
    screenFrame: "bg-background",
    sectionTitle: "text-base font-extrabold leading-6 text-foreground",
    submitAction: "w-full rounded-lg",
    title: "text-[24px] font-extrabold leading-8 text-foreground",
  },
  variants: {
    progressStatus: {
      COMPLETED: {
        progressMark: "text-success",
        progressLabel: "text-foreground",
      },
      CURRENT: {
        progressMark: "text-warning",
        progressLabel: "text-warning",
      },
      PENDING: {},
    },
  },
  defaultVariants: {
    progressStatus: "PENDING",
  },
});
const classNames = reservationPaymentCheckoutScreenClassNames();

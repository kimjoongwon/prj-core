import { observer } from "mobx-react-lite";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { tv } from "tailwind-variants";
import { Button } from "../../action/Button";
import { Icon } from "../../icon";
import { ScreenFrame } from "../../layout/ScreenFrame";
import { SpaceSelectionList } from "../../selection/SpaceSelectionList";
import { StatusFeedback } from "../../feedback/StatusFeedback";
import type { SpaceListItemInfo } from "../../data-display/SpaceListItem";

export type SpaceSelectScreenStatus = "loading" | "ready" | "empty" | "error";

export interface SpaceSelectScreenProps {
  errorDescription?: string;
  isSubmitting?: boolean;
  onPressRetry?: () => void;
  onSelectSpace?: (space: SpaceListItemInfo) => void;
  selectionErrorDescription?: string;
  selectedSpaceId?: string | null;
  spaces?: readonly SpaceListItemInfo[];
  status?: SpaceSelectScreenStatus;
}

const SpaceSelectBody = observer(function SpaceSelectBody({
  errorDescription,
  isBusy,
  onPressRetry,
  onSelectSpace,
  selectedSpaceId,
  spaces,
  status,
}: SpaceSelectScreenProps & { isBusy: boolean }) {
  if (status === "loading") {
    return (
      <StatusFeedback
        status="loading"
        title="지점 목록을 불러오는 중입니다"
        description="예약에 사용할 지점을 확인하고 있습니다."
      />
    );
  }

  if (status === "error") {
    return (
      <StatusFeedback
        status="error"
        title="지점 목록을 확인할 수 없습니다"
        description={errorDescription ?? "잠시 후 다시 시도해 주세요."}
        primaryActionLabel="다시 시도"
        onPressPrimaryAction={onPressRetry}
      />
    );
  }

  if (status === "empty") {
    return (
      <StatusFeedback
        status="empty"
        title="선택 가능한 지점이 없습니다"
        description="플랫폼 운영 본부를 제외한 지점이 아직 연결되지 않았습니다."
        primaryActionLabel="새로고침"
        onPressPrimaryAction={onPressRetry}
      />
    );
  }

  return (
    <SpaceSelectionList
      disabled={isBusy}
      onSelectSpace={onSelectSpace}
      selectedSpaceId={selectedSpaceId}
      spaces={spaces}
    />
  );
});

export const SpaceSelectScreen = observer(function SpaceSelectScreen({
  errorDescription,
  isSubmitting = false,
  onPressRetry,
  onSelectSpace,
  selectionErrorDescription,
  selectedSpaceId,
  spaces = [],
  status = "ready",
}: SpaceSelectScreenProps) {
  const isBusy = status === "loading" || isSubmitting;

  return (
    <ScreenFrame className={classNames.screenFrame()} contentClassName="flex-1">
      <ScrollView
        className={classNames.scroll()}
        contentContainerClassName={classNames.container()}
        showsVerticalScrollIndicator={false}
      >
        <View className={classNames.header()}>
          <View className={classNames.badge()}>
            <Icon name="mapPin" size="xs" tone="accent" />
            <Text className={classNames.badgeText()}>Branch</Text>
          </View>
          <Text className={classNames.title()}>
            이용할 지점을 선택해 주세요
          </Text>
          <Text className={classNames.description()}>
            선택한 지점으로 예약 목록과 내 수강권이 연결됩니다.
          </Text>
        </View>
        {selectionErrorDescription ? (
          <StatusFeedback
            status="error"
            title="지점을 적용하지 못했습니다"
            description={selectionErrorDescription}
          />
        ) : null}
        <SpaceSelectBody
          errorDescription={errorDescription}
          isBusy={isBusy}
          onPressRetry={onPressRetry}
          onSelectSpace={onSelectSpace}
          selectedSpaceId={selectedSpaceId}
          spaces={spaces}
          status={status}
        />
        {isSubmitting ? (
          <Button className="rounded-lg" isDisabled variant="primary">
            지점 적용 중
          </Button>
        ) : null}
      </ScrollView>
    </ScreenFrame>
  );
});

SpaceSelectScreen.displayName = "SpaceSelectScreen";

const spaceSelectScreenClassNames = tv({
  slots: {
    badge:
      "self-start flex-row items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1",
    badgeText:
      "text-[11px] font-bold uppercase leading-4 text-accent-soft-foreground",
    container: "gap-5 px-4 pb-8 pt-8",
    description: "text-sm font-medium leading-5 text-muted",
    header: "gap-2",
    screenFrame: "bg-background",
    scroll: "flex-1",
    title: "text-[26px] font-extrabold leading-8 text-foreground",
  },
});

const classNames = spaceSelectScreenClassNames();

import { SpaceSelectScreen, type SpaceListItemInfo } from "@cocrepo/mo-ui";
import { useGetMySpaces, useSetCurrentSpace } from "@cocrepo/api/idp/auth";
import type { SpaceDto } from "@cocrepo/api/core/model";
import { useQueryClient } from "@tanstack/react-query";
import type { Href } from "expo-router";
import { useLocalSearchParams, useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import {
  getAuthenticatedHomePath,
  getCoreApiBaseUrl,
  resolveAuthenticatedRoutePath,
} from "@/auth/auth-config";
import { mobileSession } from "@/auth/mobile-session";
import {
  mobileApiScope,
  toMobileDecimalId,
} from "@/auth/mobile-api-scope";
import {
  toSelectableMobileSpaceInfos,
  toSpaceListItemInfos,
} from "@/auth/mobile-space-options";

const getFirstParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const resolveReturnTo = (params: Record<string, string | string[] | undefined>) =>
  resolveAuthenticatedRoutePath(
    getFirstParam(params.returnTo) || getAuthenticatedHomePath(),
  );

const findSpaceByItem = (
  spaces: readonly SpaceDto[],
  item: SpaceListItemInfo,
) =>
  spaces.find(
    (space) =>
      space.tenantId != null &&
      toMobileDecimalId(space.tenantId, "space.tenantId") === item.id,
  );

const getSelectionErrorDescription = (error: unknown) => {
  const status = (error as { response?: { status?: number } })?.response?.status;
  if (status === 403) {
    return "이 계정으로 선택할 수 없는 지점입니다.";
  }

  if (status === 401) {
    return "로그인이 만료되었습니다. 다시 로그인해 주세요.";
  }

  return "지점 선택을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.";
};

const SpaceSelectRoute = observer(() => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const rawParams = useLocalSearchParams() as Record<
    string,
    string | string[] | undefined
  >;
  const returnTo = resolveReturnTo(rawParams);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(
    mobileApiScope.tenantId,
  );
  const [selectionErrorDescription, setSelectionErrorDescription] = useState("");
  const requestOptions = { baseURL: getCoreApiBaseUrl() };

  const spacesQuery = useGetMySpaces({
    query: {
      refetchOnWindowFocus: false,
      retry: false,
    },
    request: requestOptions,
  });
  const setCurrentSpaceMutation = useSetCurrentSpace({
    request: requestOptions,
  });

  const rawSpaces = spacesQuery.data?.data ?? [];
  const selectableSpaceInfos = toSelectableMobileSpaceInfos(rawSpaces);
  const spaceItems = toSpaceListItemInfos(selectableSpaceInfos);
  const status = spacesQuery.isLoading
    ? "loading"
    : spacesQuery.isError
      ? "error"
      : spaceItems.length === 0
        ? "empty"
        : "ready";

  const onPressRetry = () => {
    setSelectionErrorDescription("");
    void spacesQuery.refetch();
  };

  const onSelectSpace = async (item: SpaceListItemInfo) => {
    const selectedSpace = findSpaceByItem(rawSpaces, item);
    if (!selectedSpace) {
      setSelectionErrorDescription("선택한 지점 정보를 다시 불러와 주세요.");
      return;
    }

    setSelectedSpaceId(item.id);
    setSelectionErrorDescription("");
    try {
      const response = await setCurrentSpaceMutation.mutateAsync({
        tenantId: item.id,
      });
      await mobileSession.selectSpace(response.data ?? selectedSpace);
      await queryClient.invalidateQueries();
      router.replace(returnTo as Href);
    } catch (error) {
      setSelectionErrorDescription(getSelectionErrorDescription(error));
    }
  };

  return (
    <SpaceSelectScreen
      errorDescription="지점 목록을 불러오지 못했습니다."
      isSubmitting={setCurrentSpaceMutation.isPending}
      onPressRetry={onPressRetry}
      onSelectSpace={onSelectSpace}
      selectionErrorDescription={selectionErrorDescription}
      selectedSpaceId={selectedSpaceId}
      spaces={spaceItems}
      status={status}
    />
  );
});

export default SpaceSelectRoute;

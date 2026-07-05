import type { SpaceDto } from "@cocrepo/api/idp/model";
import type { SpaceListItemInfo } from "@cocrepo/mo-ui";
import type { ImageSourcePropType } from "react-native";
import { getCoreApiBaseUrl } from "./auth-config";
import {
  isSelectableMobileSpace,
  mobileApiScope,
  toMobileSpaceInfo,
  type MobileSpaceInfo,
} from "./mobile-api-scope";

const SPACE_HEADER_NAME = "x-tenant-id";

const resolveSpaceAssetId = (space: MobileSpaceInfo) =>
  space.logoImageFileId || space.imageFileId || null;

const createSpaceImageSource = (
  space: MobileSpaceInfo,
): ImageSourcePropType | undefined => {
  const assetId = resolveSpaceAssetId(space);
  if (!assetId) {
    return undefined;
  }

  const headers: Record<string, string> = {
    [SPACE_HEADER_NAME]: space.tenantId,
  };
  if (mobileApiScope.accessToken) {
    headers.Authorization = `Bearer ${mobileApiScope.accessToken}`;
  }

  return {
    headers,
    uri: `${getCoreApiBaseUrl()}/api/v1/assets/${assetId}/content`,
  };
};

export const toSelectableMobileSpaceInfos = (
  spaces: readonly SpaceDto[],
): MobileSpaceInfo[] =>
  spaces.filter(isSelectableMobileSpace).map(toMobileSpaceInfo);

export const toSpaceListItemInfo = (
  space: MobileSpaceInfo,
): SpaceListItemInfo => ({
  address: space.address,
  id: space.tenantId,
  imageSource: createSpaceImageSource(space),
  name: space.groundName,
});

export const toSpaceListItemInfos = (
  spaces: readonly MobileSpaceInfo[],
): SpaceListItemInfo[] => spaces.map(toSpaceListItemInfo);

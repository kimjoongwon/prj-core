import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import * as SecureStore from "expo-secure-store";
import SpaceSelectRoute from "@/app/select-space";
import { mobileApiScope } from "@/auth/mobile-api-scope";

const mockInvalidateQueries = jest.fn();
const mockMutateAsync = jest.fn();
const mockReplace = jest.fn();
const mockUseGetMySpaces = jest.fn();
const mockUseLocalSearchParams = jest.fn();

interface SelectableSpaceItem {
  id: string;
  name?: string;
  address?: string | null;
}

interface SpaceSelectScreenProps {
  onPressRetry?: () => void;
  onSelectSpace?: (space: SelectableSpaceItem) => void;
  spaces?: SelectableSpaceItem[];
  status?: string;
}

jest.mock("expo-secure-store", () => ({
  deleteItemAsync: jest.fn(),
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => undefined),
}));

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => mockUseLocalSearchParams(),
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock("@cocrepo/api/idp/auth", () => ({
  useGetMySpaces: (...args: unknown[]) => mockUseGetMySpaces(...args),
  useSetCurrentSpace: jest.fn(() => ({
    isPending: false,
    mutateAsync: mockMutateAsync,
  })),
}));

jest.mock("@cocrepo/mo-ui", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { Pressable, Text, View } =
    jest.requireActual<typeof import("react-native")>("react-native");

  return {
    SpaceSelectScreen: ({
      onPressRetry,
      onSelectSpace,
      spaces = [],
      status,
    }: SpaceSelectScreenProps) =>
      React.createElement(View, null, [
        React.createElement(Text, { key: "status" }, `status:${status}`),
        React.createElement(
          Pressable,
          {
            accessibilityLabel: "retry-spaces",
            accessibilityRole: "button",
            key: "retry",
            onPress: onPressRetry,
          },
          React.createElement(Text, null, "retry"),
        ),
        ...spaces.map((space) =>
          React.createElement(
            Pressable,
            {
              accessibilityLabel: `space-${space.id}`,
              accessibilityRole: "button",
              key: space.id,
              onPress: () => onSelectSpace?.(space),
            },
            React.createElement(Text, null, `${space.name}:${space.address}`),
          ),
        ),
      ]),
  };
});

const branchSpace = {
  contentLanguageCode: "ko_KR",
  createdAt: "2026-05-17T00:00:00.000Z",
  fitnessCenter: {
    address: "서울 강남구 테헤란로",
    company: {
      address: "서울 강남구 테헤란로",
      logoImageFileId: "company-logo-branch",
      name: "F45",
    },
    createdAt: "2026-05-17T00:00:00.000Z",
    email: "gangnam@example.com",
    id: "fitness-center-branch",
    name: "강남점",
    phone: "02-0000-0000",
    removedAt: null,
    spaceId: "space-branch",
    updatedAt: "2026-05-17T00:00:00.000Z",
  },
  id: "space-branch",
  removedAt: null,
  tenantId: "tenant-branch",
  updatedAt: "2026-05-17T00:00:00.000Z",
};

const platformSpace = {
  ...branchSpace,
  fitnessCenter: {
    ...branchSpace.fitnessCenter,
    id: "fitness-center-system",
    name: "플랫폼 운영본부",
    spaceId: "01J00000000000000000000001",
  },
  id: "01J00000000000000000000001",
  tenantId: "tenant-system",
};

describe("mobile select space route", () => {
  beforeEach(() => {
    mockInvalidateQueries.mockReset();
    mockMutateAsync.mockReset();
    mockReplace.mockReset();
    mockUseGetMySpaces.mockReset();
    mockUseLocalSearchParams.mockReset();
    mockUseLocalSearchParams.mockReturnValue({ returnTo: "/" });
    (SecureStore.setItemAsync as jest.Mock).mockClear();
    mobileApiScope.clear();
  });

  it("플랫폼 운영본부를 제외한 지점 목록을 보여주고 선택 지점을 x-tenant-id scope로 저장한다", async () => {
    mockUseGetMySpaces.mockReturnValue({
      data: { data: [platformSpace, branchSpace] },
      isError: false,
      isLoading: false,
      refetch: jest.fn(),
    });
    mockMutateAsync.mockResolvedValue({ data: branchSpace });

    render(<SpaceSelectRoute />);

    expect(screen.getByText("status:ready")).toBeTruthy();
    expect(screen.getByText("강남점:서울 강남구 테헤란로")).toBeTruthy();
    expect(screen.queryByText(/플랫폼 운영본부/)).toBeNull();

    fireEvent.press(screen.getByLabelText("space-tenant-branch"));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({ tenantId: "tenant-branch" });
    });
    expect(mobileApiScope.tenantId).toBe("tenant-branch");
    expect(mobileApiScope.spaceId).toBe("space-branch");
    expect(mobileApiScope.fitnessCenterName).toBe("강남점");
    const persistedSelectionCall = (
      SecureStore.setItemAsync as jest.Mock
    ).mock.calls.find(([key]) => String(key).includes("space-selection"));
    expect(JSON.parse(persistedSelectionCall?.[1] ?? "{}")).toMatchObject({
      fitnessCenterName: "강남점",
      logoImageFileId: "company-logo-branch",
      version: 2,
    });
    expect(mockInvalidateQueries).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith("/");
  });
});

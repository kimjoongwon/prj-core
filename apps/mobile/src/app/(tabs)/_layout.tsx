import { Tabs } from "expo-router";
import type {
	BottomTabBarButtonProps,
	BottomTabHeaderProps,
} from "@react-navigation/bottom-tabs";
import {
	AnimatedTabIcon,
	CustomHeader,
	SpaceSelectionSheet,
	type SpaceListItemInfo,
	useThemeColor,
} from "@cocrepo/mo-ui";
import { useGetMySpaces, useSetCurrentSpace } from "@cocrepo/api/core/auth";
import type { SpaceDto } from "@cocrepo/api/core/model";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import {
	Pressable,
	type GestureResponderEvent,
	type PressableProps,
} from "react-native";
import { getCoreApiBaseUrl } from "@/auth/auth-config";
import { mobileSession } from "@/auth/mobile-session";
import { mobileApiScope } from "@/auth/mobile-api-scope";
import {
	toSelectableMobileSpaceInfos,
	toSpaceListItemInfos,
} from "@/auth/mobile-space-options";

interface TabBarIconProps {
	color: string;
	focused: boolean;
	size: number;
}

const INITIAL_TAB_ANIMATION_KEYS = {
	community: 0,
	home: 0,
	profile: 0,
	reservations: 0,
};

type TabAnimationKeyName = keyof typeof INITIAL_TAB_ANIMATION_KEYS;
type TabAnimationKeys = typeof INITIAL_TAB_ANIMATION_KEYS;

const getNextTabAnimationKeys = (
	keys: TabAnimationKeys,
	tabName: TabAnimationKeyName,
) => ({
	...keys,
	[tabName]: keys[tabName] + 1,
});

const getTabHeaderTitle = (props: BottomTabHeaderProps) => {
	if (typeof props.options.title === "string") {
		return props.options.title;
	}

	return props.route.name;
};

const findSpaceByItem = (
	spaces: readonly SpaceDto[],
	item: SpaceListItemInfo,
) => spaces.find((space) => space.tenantId === item.id);

const getHeaderSubtitle = () =>
	mobileApiScope.fitnessCenterName || "지점 선택";

const MobileTabHeader = observer((props: BottomTabHeaderProps) => {
	const queryClient = useQueryClient();
	const [isSpaceSheetOpen, setIsSpaceSheetOpen] = useState(false);
	const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(
		mobileApiScope.tenantId,
	);
	const [selectionErrorDescription, setSelectionErrorDescription] =
		useState("");
	const requestOptions = { baseURL: getCoreApiBaseUrl() };
	const spacesQuery = useGetMySpaces({
		query: {
			enabled: isSpaceSheetOpen,
			refetchOnWindowFocus: false,
			retry: false,
		},
		request: requestOptions,
	});
	const setCurrentSpaceMutation = useSetCurrentSpace({
		request: requestOptions,
	});
	const rawSpaces = spacesQuery.data?.data ?? [];
	const spaceInfos =
		rawSpaces.length > 0
			? toSelectableMobileSpaceInfos(rawSpaces)
			: mobileApiScope.spaces;
	const spaceItems = toSpaceListItemInfos(spaceInfos);

	const onPressSubtitle = () => {
		setSelectedSpaceId(mobileApiScope.tenantId);
		setSelectionErrorDescription("");
		setIsSpaceSheetOpen(true);
	};

	const onOpenChangeSpaceSheet = (isOpen: boolean) => {
		setIsSpaceSheetOpen(isOpen);
		if (!isOpen) {
			setSelectionErrorDescription("");
		}
	};

	const onSelectSpace = async (item: SpaceListItemInfo) => {
		setSelectedSpaceId(item.id);
		setSelectionErrorDescription("");
		try {
			const response = await setCurrentSpaceMutation.mutateAsync({
				tenantId: item.id,
			});
			const selectedSpace = response.data ?? findSpaceByItem(rawSpaces, item);
			if (selectedSpace) {
				await mobileSession.selectSpace(selectedSpace);
			} else {
				const selectedInfo = spaceInfos.find((space) => space.tenantId === item.id);
				if (selectedInfo) {
					await mobileSession.selectSpaceInfo(selectedInfo);
				}
			}
			setIsSpaceSheetOpen(false);
			await queryClient.invalidateQueries();
		} catch {
			setSelectionErrorDescription("지점 변경을 저장하지 못했습니다.");
		}
	};

	return (
		<>
			<CustomHeader
				title={getTabHeaderTitle(props)}
				subtitle={getHeaderSubtitle()}
				onPressSubtitle={onPressSubtitle}
				subtitleAccessibilityLabel="현재 지점 변경"
			/>
			<SpaceSelectionSheet
				description={
					selectionErrorDescription || "예약에 사용할 지점을 선택해 주세요."
				}
				disabled={setCurrentSpaceMutation.isPending}
				isOpen={isSpaceSheetOpen}
				onOpenChange={onOpenChangeSpaceSheet}
				onSelectSpace={onSelectSpace}
				selectedSpaceId={selectedSpaceId}
				spaces={spaceItems}
			/>
		</>
	);
});

const renderTabHeader = (props: BottomTabHeaderProps) => (
	<MobileTabHeader {...props} />
);

const renderTabBarButton = (
	props: BottomTabBarButtonProps,
	onPressTab: () => void,
) => {
	const {
		onPress,
		ref: _ref,
		...pressableProps
	} = props as BottomTabBarButtonProps & { ref?: unknown };
	const onPressTabButton = (event: GestureResponderEvent) => {
		onPressTab();
		onPress?.(event);
	};

	return (
		<Pressable
			{...(pressableProps as PressableProps)}
			onPress={onPressTabButton}
		/>
	);
};

const renderHomeTabIcon = (
	{ color, focused, size }: TabBarIconProps,
	animationKey: number,
) => (
	<AnimatedTabIcon
		animationKey={animationKey}
		color={color}
		focused={focused}
		name="house"
		size={size}
		strokeWidth={focused ? 2 : 1.75}
	/>
);

const renderReservationsTabIcon = (
	{ color, focused, size }: TabBarIconProps,
	animationKey: number,
) => (
	<AnimatedTabIcon
		animationKey={animationKey}
		color={color}
		focused={focused}
		name="calendarCheck"
		size={size}
		strokeWidth={focused ? 2 : 1.75}
	/>
);

const renderCommunityTabIcon = (
	{ color, focused, size }: TabBarIconProps,
	animationKey: number,
) => (
	<AnimatedTabIcon
		animationKey={animationKey}
		color={color}
		focused={focused}
		name="users"
		size={size}
		strokeWidth={focused ? 2 : 1.75}
	/>
);

const renderProfileTabIcon = (
	{ color, focused, size }: TabBarIconProps,
	animationKey: number,
) => (
	<AnimatedTabIcon
		animationKey={animationKey}
		color={color}
		focused={focused}
		name="userRound"
		size={size}
		strokeWidth={focused ? 2 : 1.75}
	/>
);

const MainTabsLayout = observer(() => {
	const [accent, muted, surface, border] = useThemeColor([
		"accent",
		"muted",
		"surface",
		"border",
	]);
	const [tabAnimationKeys, setTabAnimationKeys] = useState(
		INITIAL_TAB_ANIMATION_KEYS,
	);

	const onPressHomeTab = () => {
		setTabAnimationKeys((keys) => getNextTabAnimationKeys(keys, "home"));
	};

	const onPressReservationsTab = () => {
		setTabAnimationKeys((keys) =>
			getNextTabAnimationKeys(keys, "reservations"),
		);
	};

	const onPressCommunityTab = () => {
		setTabAnimationKeys((keys) => getNextTabAnimationKeys(keys, "community"));
	};

	const onPressProfileTab = () => {
		setTabAnimationKeys((keys) => getNextTabAnimationKeys(keys, "profile"));
	};

	const onRenderHomeTabIcon = (props: TabBarIconProps) =>
		renderHomeTabIcon(props, tabAnimationKeys.home);

	const onRenderReservationsTabIcon = (props: TabBarIconProps) =>
		renderReservationsTabIcon(props, tabAnimationKeys.reservations);

	const onRenderCommunityTabIcon = (props: TabBarIconProps) =>
		renderCommunityTabIcon(props, tabAnimationKeys.community);

	const onRenderProfileTabIcon = (props: TabBarIconProps) =>
		renderProfileTabIcon(props, tabAnimationKeys.profile);

	const onRenderHomeTabButton = (props: BottomTabBarButtonProps) =>
		renderTabBarButton(props, onPressHomeTab);

	const onRenderReservationsTabButton = (props: BottomTabBarButtonProps) =>
		renderTabBarButton(props, onPressReservationsTab);

	const onRenderCommunityTabButton = (props: BottomTabBarButtonProps) =>
		renderTabBarButton(props, onPressCommunityTab);

	const onRenderProfileTabButton = (props: BottomTabBarButtonProps) =>
		renderTabBarButton(props, onPressProfileTab);

	return (
		<Tabs
			screenOptions={{
				header: renderTabHeader,
				tabBarActiveTintColor: accent,
				tabBarInactiveTintColor: muted,
				tabBarLabelStyle: {
					fontSize: 11,
					fontWeight: "800",
				},
				tabBarStyle: {
					backgroundColor: surface,
					borderTopColor: border,
					borderTopWidth: 1,
					minHeight: 56,
					paddingBottom: 6,
					paddingTop: 6,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					tabBarButton: onRenderHomeTabButton,
					tabBarIcon: onRenderHomeTabIcon,
					tabBarLabel: "홈",
					title: "오늘의 수업",
				}}
			/>
			<Tabs.Screen
				name="reservations"
				options={{
					tabBarButton: onRenderReservationsTabButton,
					tabBarIcon: onRenderReservationsTabIcon,
					tabBarLabel: "예약",
					title: "예약",
				}}
			/>
			<Tabs.Screen
				name="community"
				options={{
					tabBarButton: onRenderCommunityTabButton,
					tabBarIcon: onRenderCommunityTabIcon,
					tabBarLabel: "커뮤니티",
					title: "커뮤니티",
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					tabBarButton: onRenderProfileTabButton,
					tabBarIcon: onRenderProfileTabIcon,
					tabBarLabel: "내 정보",
					title: "내 정보",
				}}
			/>
		</Tabs>
	);
});

export default MainTabsLayout;

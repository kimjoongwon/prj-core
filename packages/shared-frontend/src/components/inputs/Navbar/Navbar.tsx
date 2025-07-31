import { Button } from "@heroui/react";
import { Route } from "@shared/types";
import { memo, useCallback, useMemo } from "react";
import { HStack, VStack } from "../../../..";
import { renderLucideIcon } from "../../../utils/iconUtils";
import { NavbarProps } from "./types";
import { getRouteDisplayText, getRouteKey, isRouteClickable } from "./utils";

const NavbarButton = memo(({ 
	route, 
	onRouteClick 
}: { 
	route: Route; 
	onRouteClick?: (route: Route) => void;
}) => {
	const handleClick = useCallback(() => {
		if (isRouteClickable(route) && onRouteClick) {
			onRouteClick(route);
		}
	}, [route, onRouteClick]);

	return (
		<Button
			variant="light"
			color={route.active ? "primary" : "default"}
			onPress={handleClick}
			startContent={
				route.icon ? renderLucideIcon(route.icon, "w-4 h-4", 16) : undefined
			}
		>
			{getRouteDisplayText(route)}
		</Button>
	);
});

NavbarButton.displayName = "NavbarButton";

export const Navbar = memo<NavbarProps>(({ 
	routes = [], 
	direction = "horizontal", 
	onRouteClick 
}) => {
	const buttons = useMemo(() => 
		routes.map((route, index) => (
			<NavbarButton
				key={getRouteKey(route, index)}
				route={route}
				onRouteClick={onRouteClick}
			/>
		)), 
		[routes, onRouteClick]
	);

	const Container = direction === "vertical" ? VStack : HStack;
	const containerClassName = direction === "vertical" 
		? "gap-2" 
		: "flex-1 gap-2 items-center justify-center";

	return (
		<Container className={containerClassName}>
			{buttons}
		</Container>
	);
});

Navbar.displayName = "Navbar";
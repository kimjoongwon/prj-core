import { Button } from "@heroui/react";
import { memo, useCallback, useMemo } from "react";
import { renderLucideIcon } from "../../../utils";
import { HStack, VStack } from "..";
import { NavbarProps, Route } from "./types";
import { getRouteDisplayText, getRouteKey, isRouteClickable } from "./utils";

export const Navbar = memo<NavbarProps>(
	({ routes = [], direction = "horizontal", onRouteClick }) => {
		const handleRouteClick = useCallback(
			(route: Route) => {
				if (isRouteClickable(route) && onRouteClick) {
					onRouteClick(route);
				}
			},
			[onRouteClick],
		);

		const buttons = useMemo(
			() =>
				routes.map((route, index) => (
					<Button
						key={getRouteKey(route, index)}
						variant="light"
						color={route.active ? "primary" : "default"}
						onPress={() => handleRouteClick(route)}
						startContent={
							route.icon
								? renderLucideIcon(route.icon, "w-4 h-4", 16)
								: undefined
						}
					>
						{getRouteDisplayText(route)}
					</Button>
				)),
			[routes, handleRouteClick],
		);

		const Container = direction === "vertical" ? VStack : HStack;
		const containerClassName =
			direction === "vertical"
				? "gap-2"
				: "flex-1 gap-2 items-center justify-center";

		return <Container className={containerClassName}>{buttons}</Container>;
	},
);

Navbar.displayName = "Navbar";

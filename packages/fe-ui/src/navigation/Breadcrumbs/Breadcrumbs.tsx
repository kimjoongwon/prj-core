"use client";

import { Breadcrumbs as HeroBreadcrumbs } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

const BreadcrumbsComponent = observer(
	(props: ComponentProps<typeof HeroBreadcrumbs>) => {
		return <HeroBreadcrumbs {...props} />;
	},
);

BreadcrumbsComponent.displayName = "Breadcrumbs";

export const Breadcrumbs = Object.assign(BreadcrumbsComponent, {
	Root: HeroBreadcrumbs.Root,
	Item: HeroBreadcrumbs.Item,
}) as unknown as typeof HeroBreadcrumbs;

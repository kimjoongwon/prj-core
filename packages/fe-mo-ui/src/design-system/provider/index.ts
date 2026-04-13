import {
	Fragment,
	createElement,
	type ComponentPropsWithoutRef,
} from "react";
import * as HeroPortalRuntime from "heroui-native/portal";
import * as HeroProviderRuntime from "heroui-native/provider";
import type { HeroUINativeConfig } from "heroui-native/provider";

const HeroUINativeProvider =
	HeroProviderRuntime.HeroUINativeProvider ??
	(HeroProviderRuntime as {
		default?: typeof HeroProviderRuntime.HeroUINativeProvider;
	}).default;

const HeroPortalHost =
	HeroPortalRuntime.PortalHost ??
	(HeroPortalRuntime as {
		default?: typeof HeroPortalRuntime.PortalHost;
	}).default;

type HeroUINativeProviderComponentProps = ComponentPropsWithoutRef<
	NonNullable<typeof HeroProviderRuntime.HeroUINativeProvider>
>;
type HeroPortalHostProps = ComponentPropsWithoutRef<
	NonNullable<typeof HeroPortalRuntime.PortalHost>
>;

export type DesignSystemProviderProps = HeroUINativeProviderComponentProps & {};
export type PortalHostProps = HeroPortalHostProps & {};

export const DesignSystemProvider = (props: DesignSystemProviderProps) =>
	HeroUINativeProvider
		? createElement(HeroUINativeProvider, props)
		: createElement(Fragment, null, props.children);

DesignSystemProvider.displayName = "DesignSystemProvider";

export const PortalHost = (props: PortalHostProps) =>
	HeroPortalHost ? createElement(HeroPortalHost, props) : null;

PortalHost.displayName = "PortalHost";

export type { HeroUINativeConfig };

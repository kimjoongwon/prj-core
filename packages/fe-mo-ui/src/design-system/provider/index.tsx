import { type HeroUINativeConfig, HeroUINativeProvider } from "heroui-native";
import { type ComponentPropsWithoutRef } from "react";

export type { PortalHostProps } from "../portal";
export { PortalHost } from "../portal";

type HeroUINativeProviderComponentProps = ComponentPropsWithoutRef<
	typeof HeroUINativeProvider
>;

export type DesignSystemProviderProps = HeroUINativeProviderComponentProps & {};

export const DesignSystemProvider = (props: DesignSystemProviderProps) => (
	<HeroUINativeProvider {...props} />
);
DesignSystemProvider.displayName = "DesignSystemProvider";

export type { HeroUINativeConfig };

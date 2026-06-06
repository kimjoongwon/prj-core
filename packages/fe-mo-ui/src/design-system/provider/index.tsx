import { type ComponentPropsWithoutRef } from "react";
import {
  HeroUINativeProvider,
  type HeroUINativeConfig,
} from "heroui-native";
export { PortalHost } from "../portal";
export type { PortalHostProps } from "../portal";

type HeroUINativeProviderComponentProps = ComponentPropsWithoutRef<
  typeof HeroUINativeProvider
>;

export type DesignSystemProviderProps = HeroUINativeProviderComponentProps & {};

export const DesignSystemProvider = (props: DesignSystemProviderProps) =>
  <HeroUINativeProvider {...props} />;
DesignSystemProvider.displayName = "DesignSystemProvider";

export type { HeroUINativeConfig };

import { type ComponentPropsWithoutRef } from "react";
import { PortalHost as HeroPortalHost } from "heroui-native/portal";

export type PortalHostProps = ComponentPropsWithoutRef<
  typeof HeroPortalHost
> & {};

export const PortalHost = (props: PortalHostProps) => (
  <HeroPortalHost {...props} />
);

PortalHost.displayName = "PortalHost";

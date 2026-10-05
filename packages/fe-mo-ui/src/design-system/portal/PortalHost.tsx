import { PortalHost as HeroPortalHost } from "heroui-native/portal";
import { type ComponentPropsWithoutRef } from "react";

export type PortalHostProps = ComponentPropsWithoutRef<
	typeof HeroPortalHost
> & {};

export const PortalHost = (props: PortalHostProps) => (
	<HeroPortalHost {...props} />
);

PortalHost.displayName = "PortalHost";

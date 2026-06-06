import { type ComponentPropsWithoutRef } from "react";
import { Portal as HeroPortal } from "heroui-native/portal";

export type PortalProps = ComponentPropsWithoutRef<typeof HeroPortal> & {};

export const Portal = (props: PortalProps) => <HeroPortal {...props} />;

Portal.displayName = "Portal";

import { Portal as HeroPortal } from "heroui-native/portal";
import { type ComponentPropsWithoutRef } from "react";

export type PortalProps = ComponentPropsWithoutRef<typeof HeroPortal> & {};

export const Portal = (props: PortalProps) => <HeroPortal {...props} />;

Portal.displayName = "Portal";

import { Kbd as HeroKbd, type KbdProps as HeroKbdProps } from "@heroui/react";

export type KbdProps = HeroKbdProps;

const KbdInternal = (props: KbdProps) => {
	return <HeroKbd {...props} />;
};

export const Kbd = Object.assign(KbdInternal, HeroKbd) as typeof HeroKbd;

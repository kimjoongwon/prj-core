import {
	controlFieldClassNames,
	ControlField as HeroControlField,
	useControlField,
} from "heroui-native/control-field";
import { type ComponentPropsWithoutRef } from "react";

type HeroControlFieldProps = ComponentPropsWithoutRef<typeof HeroControlField>;

export type PureControlFieldProps = HeroControlFieldProps;
export const PureControlField = HeroControlField;
export const ControlField = PureControlField;
export type ControlFieldProps = PureControlFieldProps;
export { controlFieldClassNames, useControlField };
export type * from "heroui-native/control-field";

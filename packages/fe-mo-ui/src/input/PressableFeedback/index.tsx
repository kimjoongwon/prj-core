"use client";

import { observer } from "mobx-react-lite";
import type { ComponentPropsWithoutRef } from "react";
import {
	PressableFeedback as PurePressableFeedback,
	pressableFeedbackClassNames,
} from "./PressableFeedback";

type PressableFeedbackProps = ComponentPropsWithoutRef<
	typeof PurePressableFeedback
>;

const PressableFeedback = observer((props: PressableFeedbackProps) => {
	return <PurePressableFeedback {...props} />;
});

const PressableFeedbackWithStatics = Object.assign(
	PressableFeedback,
	PurePressableFeedback,
) as typeof PurePressableFeedback;

export {
	PressableFeedbackWithStatics as PressableFeedback,
	pressableFeedbackClassNames,
};
export type * from "./PressableFeedback";
export type { PressableFeedbackProps };

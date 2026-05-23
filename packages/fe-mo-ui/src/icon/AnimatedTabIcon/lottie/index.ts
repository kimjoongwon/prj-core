import type { AnimationObject } from "lottie-react-native";
import type { MobileIconName } from "../../Icon";
import calendarCheckAnimation from "./calendar-check.json";
import houseAnimation from "./house.json";
import userRoundAnimation from "./user-round.json";

export const animatedTabIconAnimations = {
  calendarCheck: calendarCheckAnimation,
  house: houseAnimation,
  userRound: userRoundAnimation,
} as const satisfies Partial<Record<MobileIconName, AnimationObject>>;

export type AnimatedTabIconName = keyof typeof animatedTabIconAnimations;


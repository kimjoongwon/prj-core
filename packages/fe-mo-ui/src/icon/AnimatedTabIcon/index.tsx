import LottieView, { type AnimationObject } from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, View } from "react-native";
import { Icon, type IconProps, type MobileIconName } from "../Icon";
import {
  animatedTabIconAnimations,
  type AnimatedTabIconName,
} from "./lottie";

export interface AnimatedTabIconProps {
  animationKey?: number;
  color: string;
  focused: boolean;
  name: MobileIconName;
  size: IconProps["size"];
  strokeWidth?: number;
}

const ICON_SIZE_VALUES = {
  lg: 22,
  md: 18,
  sm: 16,
  xs: 14,
} as const satisfies Record<NonNullable<IconProps["size"]> & string, number>;

const resolveIconSize = (size: IconProps["size"]) =>
  typeof size === "number" ? size : ICON_SIZE_VALUES[size ?? "sm"];

const getAnimation = (name: MobileIconName) =>
  animatedTabIconAnimations[name as AnimatedTabIconName] as
    | AnimationObject
    | undefined;

const getLottieColorFilters = (color: string) => [
  {
    color,
    keypath: "primary.**",
  },
  {
    color,
    keypath: "accent.**",
  },
];

export const AnimatedTabIcon = ({
  animationKey = 0,
  color,
  focused,
  name,
  size,
  strokeWidth = 1.75,
}: AnimatedTabIconProps) => {
  const animationRef = useRef<LottieView>(null);
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const [hasAnimationFailure, setHasAnimationFailure] = useState(false);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(true);
  const resolvedSize = resolveIconSize(size);
  const animation = getAnimation(name);
  const shouldAnimateFocus = focused && !isReduceMotionEnabled;
  const shouldShowLottie =
    focused && !hasAnimationFailure && !isReduceMotionEnabled && !!animation;
  const iconSize = focused ? resolvedSize + 1 : resolvedSize;
  const iconStrokeWidth = focused ? Math.max(strokeWidth, 2) : strokeWidth;
  const iconLiftAnimation = scaleAnimation.interpolate({
    inputRange: [0.92, 1, 1.24],
    outputRange: [1, 0, -4],
  });

  useEffect(() => {
    setHasAnimationFailure(false);
  }, [name]);

  useEffect(() => {
    let isMounted = true;
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setIsReduceMotionEnabled,
    );

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (isMounted) {
          setIsReduceMotionEnabled(enabled);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsReduceMotionEnabled(false);
        }
      });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (shouldShowLottie) {
      animationRef.current?.reset();
      animationRef.current?.play(0, 54);
    }
  }, [name, shouldShowLottie]);

  useEffect(() => {
    scaleAnimation.stopAnimation();

    if (!shouldAnimateFocus) {
      scaleAnimation.setValue(1);
      return;
    }

    scaleAnimation.setValue(1);
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        duration: 130,
        toValue: 1.28,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        duration: 120,
        toValue: 0.9,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        friction: 4,
        tension: 190,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animationKey, name, scaleAnimation, shouldAnimateFocus]);

  const onAnimationLoaded = () => {
    if (shouldShowLottie) {
      animationRef.current?.reset();
      animationRef.current?.play(0, 54);
    }
  };

  const onAnimationFailure = () => {
    setHasAnimationFailure(true);
  };

  return (
    <View
      className="items-center justify-center"
      style={{
        height: resolvedSize + 12,
        width: resolvedSize + 12,
      }}
    >
      {shouldShowLottie && animation ? (
        <LottieView
          autoPlay
          colorFilters={getLottieColorFilters(color)}
          duration={900}
          loop={false}
          onAnimationFailure={onAnimationFailure}
          onAnimationLoaded={onAnimationLoaded}
          ref={animationRef}
          resizeMode="contain"
          source={animation}
          style={{
            height: resolvedSize + 24,
            left: -6,
            position: "absolute",
            top: -6,
            width: resolvedSize + 24,
          }}
          testID={`animated-tab-icon-${name}`}
        />
      ) : null}
      <Animated.View
        style={{
          transform: [
            { translateY: iconLiftAnimation },
            { scale: scaleAnimation },
          ],
        }}
        testID={`animated-tab-icon-fallback-${name}`}
      >
        <Icon
          color={color}
          name={name}
          size={iconSize}
          strokeWidth={iconStrokeWidth}
        />
      </Animated.View>
    </View>
  );
};

AnimatedTabIcon.displayName = "AnimatedTabIcon";

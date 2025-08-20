import React, { useEffect, useMemo } from "react";
import { config } from "./config";
import { View, ViewProps } from "react-native";
import { OverlayProvider } from "@gluestack-ui/overlay";
import { ToastProvider } from "@gluestack-ui/toast";
import { useColorScheme } from "nativewind";

export type ModeType = "light" | "dark" | "system";

export interface GluestackUIProviderProps {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps["style"];
}

export function GluestackUIProvider({
  mode = "system",
  children,
  style,
}: GluestackUIProviderProps) {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    if (mode !== "system") {
      setColorScheme(mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const themeStyles = useMemo(() => {
    const currentScheme = colorScheme || "light";
    return config[currentScheme as keyof typeof config];
  }, [colorScheme]);

  const containerStyle = useMemo(
    () => [
      themeStyles,
      {
        flex: 1,
        backgroundColor: `rgb(var(--color-background))`,
      },
      style,
    ],
    [themeStyles, style]
  );

  return (
    <View style={containerStyle}>
      <OverlayProvider>
        <ToastProvider>{children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}

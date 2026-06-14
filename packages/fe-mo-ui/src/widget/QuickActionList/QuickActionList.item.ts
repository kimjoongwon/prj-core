import type { ReactNode } from "react";
import type { MobileIconName } from "../../icon";

export interface QuickActionListItem {
  description: ReactNode;
  disabled?: boolean;
  iconName: MobileIconName;
  id: string;
  label: ReactNode;
  onPress?: () => void;
}

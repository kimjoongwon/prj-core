import type { ViewProps } from "react-native";
import type { QuickActionListItem } from "./QuickActionList.item";

export interface QuickActionListProps extends Omit<ViewProps, "children"> {
  items: readonly QuickActionListItem[];
}

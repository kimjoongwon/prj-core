import type { QuickActionListItem } from "../../widget/QuickActionList";

export interface MyPageScreenProps {
  accountDescription: string;
  currentSpaceName: string;
  displayName: string;
  isAuthenticated: boolean;
  isLogoutPending?: boolean;
  onPressLogout?: () => void;
  quickActions: readonly QuickActionListItem[];
}

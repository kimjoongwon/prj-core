import type { ComponentPropsWithoutRef } from "react";
import { useThemeColor, type ThemeColor } from "heroui-native";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  Circle,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleSlash,
  Clock,
  CreditCard,
  Hourglass,
  House,
  Info,
  ListChecks,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Receipt,
  ShieldCheck,
  TicketCheck,
  TriangleAlert,
  UserRound,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react-native";

export const mobileIcons = {
  arrowRight: ArrowRight,
  badgeCheck: BadgeCheck,
  calendarCheck: CalendarCheck,
  calendarClock: CalendarClock,
  calendarDays: CalendarDays,
  calendarRange: CalendarRange,
  chevronLeft: ChevronLeft,
  circle: Circle,
  circleAlert: CircleAlert,
  circleCheck: CircleCheck,
  circleDashed: CircleDashed,
  circleSlash: CircleSlash,
  clock: Clock,
  creditCard: CreditCard,
  hourglass: Hourglass,
  house: House,
  info: Info,
  listChecks: ListChecks,
  loaderCircle: LoaderCircle,
  lockKeyhole: LockKeyhole,
  logIn: LogIn,
  logOut: LogOut,
  mail: Mail,
  mapPin: MapPin,
  receipt: Receipt,
  shieldCheck: ShieldCheck,
  ticketCheck: TicketCheck,
  triangleAlert: TriangleAlert,
  userRound: UserRound,
  users: Users,
  walletCards: WalletCards,
} as const;

export type MobileIconName = keyof typeof mobileIcons;
export type IconSize = "xs" | "sm" | "md" | "lg";
export type IconTone =
  | "accent"
  | "accentForeground"
  | "danger"
  | "foreground"
  | "muted"
  | "success"
  | "warning";

export interface IconProps
  extends Omit<
    ComponentPropsWithoutRef<LucideIcon>,
    "color" | "height" | "size" | "strokeWidth" | "width"
  > {
  color?: string;
  name: MobileIconName;
  size?: IconSize | number;
  strokeWidth?: number;
  tone?: IconTone;
}

const ICON_SIZE_VALUES: Record<IconSize, number> = {
  lg: 22,
  md: 18,
  sm: 16,
  xs: 14,
};

const ICON_TONE_COLORS: Record<IconTone, ThemeColor> = {
  accent: "accent",
  accentForeground: "accent-foreground",
  danger: "danger",
  foreground: "foreground",
  muted: "muted",
  success: "success",
  warning: "warning",
};

const resolveIconSize = (size: IconSize | number) =>
  typeof size === "number" ? size : ICON_SIZE_VALUES[size];

export const Icon = ({
  color,
  name,
  size = "sm",
  strokeWidth = 1.75,
  tone = "foreground",
  ...props
}: IconProps) => {
  const IconGlyph = mobileIcons[name];
  const toneColor = useThemeColor(ICON_TONE_COLORS[tone]);
  return (
    <IconGlyph
      {...props}
      color={color ?? toneColor}
      size={resolveIconSize(size)}
      strokeWidth={strokeWidth}
    />
  );
};

Icon.displayName = "Icon";

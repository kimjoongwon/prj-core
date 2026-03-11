"use client";

import type { AppIconName } from "@cocrepo/type";
import {
	Building2,
	CalendarDays,
	Circle,
	Dumbbell,
	Ellipsis,
	FileSearch,
	Home,
	Images,
	KeyRound,
	LayoutDashboard,
	LayoutGrid,
	Mail,
	MessageCircleQuestionMark,
	Settings,
	Shield,
	ShieldCheck,
	Ticket,
	type LucideIcon,
	UserCog,
	Users,
} from "lucide-react";

const appIconMap: Record<AppIconName, LucideIcon> = {
	Building2,
	CalendarDays,
	Circle,
	Dumbbell,
	Ellipsis,
	FileSearch,
	Home,
	Images,
	KeyRound,
	LayoutDashboard,
	LayoutGrid,
	Mail,
	MessageCircleQuestionMark,
	Settings,
	Shield,
	ShieldCheck,
	Ticket,
	UserCog,
	Users,
};

export interface AppIconProps {
	name: AppIconName;
	className?: string;
	size?: number;
}

export function AppIcon({ name, className, size = 16 }: AppIconProps) {
	const IconComponent = appIconMap[name];

	return <IconComponent className={className} size={size} />;
}

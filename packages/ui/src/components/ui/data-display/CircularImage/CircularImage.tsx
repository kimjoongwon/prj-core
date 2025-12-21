import { cn } from "@heroui/react";

export interface CircularImageProps {
	src: string;
	alt: string;
	size?: "sm" | "md" | "lg";
	className?: string;
}

const sizeStyles = {
	sm: "w-10 h-10",
	md: "w-14 h-14",
	lg: "w-20 h-20",
};

export const CircularImage = ({
	src,
	alt,
	size = "md",
	className,
}: CircularImageProps) => {
	return (
		<img
			src={src}
			alt={alt}
			className={cn("rounded-full object-cover", sizeStyles[size], className)}
		/>
	);
};

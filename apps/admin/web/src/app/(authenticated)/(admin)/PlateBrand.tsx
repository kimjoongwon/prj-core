import Image from "next/image";
import Link from "next/link";

/** Plate 관리자 콘솔의 홈 링크와 브랜드 마크를 표시합니다. */
export const PlateBrand = () => {
	return (
		<Link
			href="/dashboard"
			aria-label="Plate 관리자 홈"
			className="mr-auto hidden min-w-0 items-center gap-2 rounded-lg py-1 pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/40 sm:flex"
		>
			<span aria-hidden="true" className="size-8 shrink-0">
				<Image
					src="/admin/brand/plate-mark.svg"
					alt=""
					width={32}
					height={32}
					unoptimized
					className="size-8 object-contain"
				/>
			</span>
			<span className="truncate font-extrabold text-[19px] leading-none tracking-[-0.035em]">
				Plate
			</span>
		</Link>
	);
};

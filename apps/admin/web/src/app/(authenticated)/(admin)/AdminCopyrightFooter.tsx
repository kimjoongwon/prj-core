/** Plate 운영 주체의 저작권과 사업자 안내 정보를 표시합니다. */
export const AdminCopyrightFooter = () => {
	return (
		<div className="grid min-h-[68px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 px-4 py-2 md:min-h-14 md:grid-cols-[16rem_minmax(0,1fr)_auto] md:gap-x-0 md:px-0 md:py-0">
			<p className="col-start-1 row-start-1 font-semibold text-[11px] text-foreground/80 leading-4 md:flex md:h-full md:flex-col md:justify-center md:border-separator md:border-r md:pl-16">
				<span>© 2026 Plate Labs Inc.</span>
				<span className="hidden font-normal text-muted md:block">
					All rights reserved.
				</span>
			</p>

			<address className="col-span-2 row-start-2 mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 not-italic text-[10px] text-muted leading-4 md:col-span-1 md:col-start-2 md:row-start-1 md:mt-0 md:px-6 md:text-[11px]">
				<span>대표 김중원</span>
				<span aria-hidden="true">·</span>
				<span>사업자등록번호 123-45-67890</span>
				<span aria-hidden="true">·</span>
				<span>서울특별시 성동구 성수이로 88, 8층</span>
			</address>

			<a
				href="mailto:support@plate.example"
				className="col-start-2 row-start-1 w-fit shrink-0 whitespace-nowrap font-medium text-[10px] text-muted underline-offset-4 hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/40 md:col-start-3 md:pr-6 md:text-[11px]"
			>
				support@plate.example
			</a>
		</div>
	);
};

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AssetThumbnail } from "../AssetThumbnail/AssetThumbnail";

// Image 컴포넌트 모킹
vi.mock("@heroui/react", () => ({
	Image: ({ src, alt, width, height, className }: any) => (
		<img
			src={src}
			alt={alt}
			width={width}
			height={height}
			className={className}
			data-testid="mock-image"
		/>
	),
}));

describe("AssetThumbnail", () => {
	describe("이미지 타입 (IMAGE)", () => {
		it("src가 있으면 이미지를 표시해야 한다", () => {
			// Given
			const src = "https://example.com/image.jpg";
			const kind = "IMAGE";

			// When
			render(<AssetThumbnail src={src} kind={kind} />);

			// Then
			const image = screen.getByTestId("mock-image");
			expect(image).toBeInTheDocument();
			expect(image).toHaveAttribute("src", src);
		});

		it("src가 없으면 아이콘(div)을 표시해야 한다", () => {
			// Given
			const kind = "IMAGE";

			// When
			const { container } = render(<AssetThumbnail kind={kind} />);

			// Then
			// 이미지가 렌더링되지 않고, 아이콘 컨테이너가 렌더링되어야 함
			expect(screen.queryByTestId("mock-image")).not.toBeInTheDocument();
			// 아이콘 컨테이너 확인 (bg-primary/10 클래스가 있는 div)
			const iconContainer = container.querySelector(".bg-primary\\/10");
			expect(iconContainer).toBeInTheDocument();
		});

		it("alt 속성이 적용되어야 한다", () => {
			// Given
			const src = "https://example.com/image.jpg";
			const alt = "테스트 이미지";
			const kind = "IMAGE";

			// When
			render(<AssetThumbnail src={src} alt={alt} kind={kind} />);

			// Then
			const image = screen.getByTestId("mock-image");
			expect(image).toHaveAttribute("alt", alt);
		});

		it("src가 null이면 아이콘(div)을 표시해야 한다", () => {
			// Given
			const kind = "IMAGE";

			// When
			const { container } = render(<AssetThumbnail src={null} kind={kind} />);

			// Then
			expect(screen.queryByTestId("mock-image")).not.toBeInTheDocument();
			const iconContainer = container.querySelector(".bg-primary\\/10");
			expect(iconContainer).toBeInTheDocument();
		});
	});

	describe("비디오 타입 (VIDEO)", () => {
		it("항상 아이콘을 표시해야 한다", () => {
			// Given
			const kind = "VIDEO";

			// When
			const { container } = render(<AssetThumbnail kind={kind} />);

			// Then
			expect(screen.queryByTestId("mock-image")).not.toBeInTheDocument();
			// 비디오 아이콘 컨테이너 확인 (bg-secondary/10 클래스)
			const iconContainer = container.querySelector(".bg-secondary\\/10");
			expect(iconContainer).toBeInTheDocument();
		});
	});

	describe("문서 타입 (DOCUMENT)", () => {
		it("항상 아이콘을 표시해야 한다", () => {
			// Given
			const kind = "DOCUMENT";

			// When
			const { container } = render(<AssetThumbnail kind={kind} />);

			// Then
			expect(screen.queryByTestId("mock-image")).not.toBeInTheDocument();
			// 문서 아이콘 컨테이너 확인 (bg-default-100 클래스)
			const iconContainer = container.querySelector(".bg-default-100");
			expect(iconContainer).toBeInTheDocument();
		});
	});

	describe("size prop", () => {
		it("size가 'sm'일 때 작은 크기로 렌더링되어야 한다", () => {
			// Given
			const kind = "DOCUMENT";
			const size = "sm";

			// When
			const { container } = render(<AssetThumbnail kind={kind} size={size} />);

			// Then
			const wrapper = container.querySelector("div");
			expect(wrapper).toHaveStyle({ width: "32px", height: "32px" });
		});

		it("size가 'md'일 때 중간 크기로 렌더링되어야 한다", () => {
			// Given
			const kind = "DOCUMENT";
			const size = "md";

			// When
			const { container } = render(<AssetThumbnail kind={kind} size={size} />);

			// Then
			const wrapper = container.querySelector("div");
			expect(wrapper).toHaveStyle({ width: "48px", height: "48px" });
		});

		it("size가 'lg'일 때 큰 크기로 렌더링되어야 한다", () => {
			// Given
			const kind = "DOCUMENT";
			const size = "lg";

			// When
			const { container } = render(<AssetThumbnail kind={kind} size={size} />);

			// Then
			const wrapper = container.querySelector("div");
			expect(wrapper).toHaveStyle({ width: "64px", height: "64px" });
		});
	});

	describe("className prop", () => {
		it("추가 className이 적용되어야 한다 (이미지)", () => {
			// Given
			const src = "https://example.com/image.jpg";
			const kind = "IMAGE";
			const customClass = "custom-thumbnail";

			// When
			render(<AssetThumbnail src={src} kind={kind} className={customClass} />);

			// Then
			const image = screen.getByTestId("mock-image");
			expect(image).toHaveClass("custom-thumbnail");
		});

		it("추가 className이 적용되어야 한다 (아이콘)", () => {
			// Given
			const kind = "DOCUMENT";
			const customClass = "custom-icon";

			// When
			const { container } = render(<AssetThumbnail kind={kind} className={customClass} />);

			// Then
			const wrapper = container.querySelector(".custom-icon");
			expect(wrapper).toBeInTheDocument();
		});
	});
});

import type { ReactNode } from "react";

export interface PageProps {
  /** 상단 헤더 영역 */
  header?: ReactNode;
  /** 페이지 상단 슬롯 */
  top?: ReactNode;
  /** 좌측 사이드바 영역 */
  leftAside?: ReactNode;
  /** 우측 사이드바 영역 */
  rightAside?: ReactNode;
  /** 페이지 하단 슬롯 */
  bottom?: ReactNode;
  /** 하단 푸터 영역 */
  footer?: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 메인 콘텐츠 영역 */
  children: ReactNode;
}

/**
 * Page 컴포넌트
 * 페이지 전체 구조를 정의하는 순수 레이아웃 컴포넌트 (HTML5 시맨틱)
 * app/(admin)/layout.tsx 등에서 사용
 *
 * 구조:
 * - header: 상단 헤더 영역
 * - leftAside: 좌측 사이드바 영역
 * - rightAside: 우측 사이드바 영역
 * - footer: 하단 푸터 영역
 * - children: 메인 콘텐츠 영역
 *
 * @example
 * ```tsx
 * // app/(admin)/layout.tsx
 * export default function AdminLayout({ children }) {
 *   return (
 *     <Page
 *       header={
 *         <div className="h-16">상단 헤더 슬롯</div>
 *       }
 *       leftAside={<SideMenu />}
 *     >
 *       {children}
 *     </Page>
 *   );
 * }
 * ```
 */
export const Page = ({
  header,
  top,
  leftAside,
  rightAside,
  bottom,
  footer,
  className,
  children,
}: PageProps) => {
  return (
    <section
      className={`flex w-full flex-col gap-4${className ? ` ${className}` : ""}`}
    >
      {header && <header>{header}</header>}
      {top && <div>{top}</div>}
      <div className="flex w-full gap-4">
        {leftAside && <aside>{leftAside}</aside>}
        <div className="min-w-0 flex-1">{children}</div>
        {rightAside && <aside>{rightAside}</aside>}
      </div>
      {bottom && <div>{bottom}</div>}
      {footer && <footer>{footer}</footer>}
    </section>
  );
};

Page.displayName = "Page";

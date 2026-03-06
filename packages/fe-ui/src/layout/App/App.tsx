import type { ReactNode } from "react";

export interface AppProps {
  /** 메인 콘텐츠 */
  children: ReactNode;
}

/**
 * App 컴포넌트
 * Next.js 최상위 layout.tsx에서만 사용하는 루트 body 래퍼
 * children만 받으며 순수하게 body를 감쌈니다.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="ko">
 *       <body>
 *         <App>{children}</App>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export const App = ({ children }: AppProps) => {
  return <>{children}</>;
};

App.displayName = "App";

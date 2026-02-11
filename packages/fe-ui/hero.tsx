/**
 * HeroUI Tailwind CSS 플러그인 설정
 *
 * 앱에서 tailwind.css에서 다음과 같이 사용합니다:
 * @plugin '@cocrepo/ui/hero';
 */

import { heroui } from "@heroui/react";
import { heroUIThemeConfig } from "./src/design-system/theme/heroui.config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default heroui(heroUIThemeConfig) as any;

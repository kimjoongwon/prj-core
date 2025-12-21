/**
 * HeroUI Tailwind CSS 플러그인 설정
 *
 * 앱에서 tailwind.css에서 다음과 같이 사용합니다:
 * @plugin '@cocrepo/design-system/hero';
 */
import { heroui } from "@heroui/react";
import { heroUIThemeConfig } from "./src/theme/heroui.config";

export default heroui(heroUIThemeConfig);

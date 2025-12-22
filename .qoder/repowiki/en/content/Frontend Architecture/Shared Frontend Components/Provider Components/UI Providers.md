# UI Providers

<cite>
**Referenced Files in This Document**   
- [DesignSystemProvider.tsx](file://packages/design-system/src/provider/DesignSystemProvider.tsx)
- [heroui.config.ts](file://packages/design-system/src/theme/heroui.config.ts)
- [tokens.ts](file://packages/design-system/src/theme/tokens.ts)
- [Providers.tsx](file://packages/provider/src/Providers.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Theme Provider Implementation](#theme-provider-implementation)
3. [Dark Mode Toggle Functionality](#dark-mode-toggle-functionality)
4. [Responsive Design Configuration](#responsive-design-configuration)
5. [Styling Context Exposure](#styling-context-exposure)
6. [Integration with Tailwind CSS](#integration-with-tailwind-css)
7. [Common Issues and Solutions](#common-issues-and-solutions)
8. [Conclusion](#conclusion)

## Introduction
The UIProviders component is responsible for managing presentation-layer contexts across the application. It serves as a central hub for theme management, responsive design configuration, and styling context distribution. This documentation details the implementation of the theme provider, dark mode toggle functionality, responsive design breakpoints, and how styling context is exposed to components throughout the application.

**Section sources**
- [DesignSystemProvider.tsx](file://packages/design-system/src/provider/DesignSystemProvider.tsx)

## Theme Provider Implementation
The theme provider implementation is built on the HeroUI framework, providing a comprehensive theming system that supports both light and dark modes. The `DesignSystemProvider` component wraps the HeroUI Provider to manage theme settings centrally. It exposes theme configuration through the `heroUIThemeConfig` object, which defines color schemes for both light and dark themes.

The theme system is configured with semantic color definitions that include primary, secondary, success, warning, and danger colors. These colors are defined in the `lightThemeColors` and `darkThemeColors` constants, with the dark theme reusing non-primary colors from the light theme for consistency. The default theme configuration specifies "light" as the default theme with baseline styles enabled.

```mermaid
classDiagram
class DesignSystemProvider {
+children : ReactNode
+themeConfig? : Partial<ThemeConfig>
+navigate? : (path : string) => void
}
class ThemeConfig {
+defaultTheme : "light" | "dark" | "system"
+disableBaseline : boolean
}
class ThemeColors {
+background : string
+foreground : string
+primary : ColorScale
+secondary : ColorScale
+success : ColorScale
+warning : ColorScale
+danger : ColorScale
}
class ColorScale {
+50 : string
+100 : string
+200 : string
+300 : string
+400 : string
+500 : string
+600 : string
+700 : string
+800 : string
+900 : string
+foreground : string
+DEFAULT : string
}
DesignSystemProvider --> ThemeConfig : "uses"
DesignSystemProvider --> ThemeColors : "applies"
ThemeColors --> ColorScale : "contains"
```

**Diagram sources**
- [DesignSystemProvider.tsx](file://packages/design-system/src/provider/DesignSystemProvider.tsx#L12-L23)
- [heroui.config.ts](file://packages/design-system/src/theme/heroui.config.ts#L156-L167)

**Section sources**
- [DesignSystemProvider.tsx](file://packages/design-system/src/provider/DesignSystemProvider.tsx)
- [heroui.config.ts](file://packages/design-system/src/theme/heroui.config.ts)

## Dark Mode Toggle Functionality
The dark mode toggle functionality is implemented through the `useDesignSystemTheme` hook, which provides methods for theme manipulation. This hook wraps the `useTheme` hook from HeroUI and exposes a `toggleTheme` function that switches between light and dark modes based on the current theme state.

The theme state is managed at the application level, ensuring consistent theme application across all components. When the theme is toggled, the change is propagated through the context system to all consuming components. The `isDark` and `isLight` boolean flags provide convenient ways to check the current theme state for conditional rendering or styling.

```mermaid
sequenceDiagram
participant Component as "UI Component"
participant Hook as "useDesignSystemTheme"
participant Context as "Theme Context"
participant Provider as "DesignSystemProvider"
Component->>Hook : Call useDesignSystemTheme()
Hook->>Context : Subscribe to theme changes
Context-->>Hook : Return theme state
Hook-->>Component : Return {theme, setTheme, toggleTheme, isDark, isLight}
Component->>Hook : Call toggleTheme()
Hook->>Context : setTheme(opposite theme)
Context->>Provider : Notify theme change
Provider->>All Components : Re-render with new theme
```

**Diagram sources**
- [DesignSystemProvider.tsx](file://packages/design-system/src/provider/DesignSystemProvider.tsx#L61-L70)

**Section sources**
- [DesignSystemProvider.tsx](file://packages/design-system/src/provider/DesignSystemProvider.tsx)

## Responsive Design Configuration
The responsive design configuration is managed through a comprehensive breakpoints system defined in the design tokens. The breakpoints are aligned with Tailwind CSS standards, providing a consistent responsive design approach across the application. The breakpoints include: sm (640px), md (768px), lg (1024px), xl (1280px), and 2xl (1536px).

These breakpoints are used to create responsive layouts that adapt to different screen sizes. The UI components can use these breakpoints to modify their behavior or appearance based on the current viewport size. The responsive design system is integrated with the styling context, allowing components to access breakpoint information and apply appropriate styles.

```mermaid
flowchart TD
Start([Application Load]) --> LoadBreakpoints["Load Breakpoints Configuration"]
LoadBreakpoints --> DefineBreakpoints["Define: sm, md, lg, xl, 2xl"]
DefineBreakpoints --> ExposeContext["Expose Breakpoints via Context"]
ExposeContext --> ComponentUsage["Components Use Breakpoints"]
ComponentUsage --> ConditionalRendering["Conditional Rendering Based on Screen Size"]
ConditionalRendering --> MobileLayout["Mobile Layout (<768px)"]
ConditionalRendering --> TabletLayout["Tablet Layout (768px-1024px)"]
ConditionalRendering --> DesktopLayout["Desktop Layout (>1024px)"]
MobileLayout --> End([Render Mobile View])
TabletLayout --> End
DesktopLayout --> End
```

**Diagram sources**
- [tokens.ts](file://packages/design-system/src/theme/tokens.ts#L99-L105)

**Section sources**
- [tokens.ts](file://packages/design-system/src/theme/tokens.ts)

## Styling Context Exposure
The UIProviders component exposes a comprehensive styling context to all components in the application. This context includes breakpoints, spacing, typography, and color schemes, all centralized in the design tokens system. The styling context is made available through the provider hierarchy, ensuring that all components have access to consistent design values.

The spacing system follows the Tailwind CSS scale with values from 0 to 24, corresponding to rem units that translate to pixel values (e.g., spacing 4 = 1rem = 16px). The typography system includes font families, font sizes with corresponding line heights, and font weights. Color schemes are exposed through both semantic colors (background, foreground, divider) and brand colors (primary, secondary, success, warning, danger).

```mermaid
classDiagram
class StylingContext {
+breakpoints : Breakpoints
+spacing : Spacing
+typography : Typography
+colors : Colors
+borderRadius : BorderRadius
+shadows : Shadows
+zIndex : ZIndex
+duration : Duration
}
class Breakpoints {
+sm : "640px"
+md : "768px"
+lg : "1024px"
+xl : "1280px"
+2xl : "1536px"
}
class Spacing {
+0 : "0"
+1 : "0.25rem"
+2 : "0.5rem"
+3 : "0.75rem"
+4 : "1rem"
+5 : "1.25rem"
+6 : "1.5rem"
+8 : "2rem"
+10 : "2.5rem"
+12 : "3rem"
+16 : "4rem"
+20 : "5rem"
+24 : "6rem"
}
class Typography {
+fontFamily : FontFamily
+fontSize : FontSize
+fontWeight : FontWeight
}
class Colors {
+brand : BrandColors
+neutral : NeutralColors
+semantic : SemanticColors
}
StylingContext --> Breakpoints
StylingContext --> Spacing
StylingContext --> Typography
StylingContext --> Colors
```

**Diagram sources**
- [tokens.ts](file://packages/design-system/src/theme/tokens.ts)

**Section sources**
- [tokens.ts](file://packages/design-system/src/theme/tokens.ts)

## Integration with Tailwind CSS
The UIProviders component integrates seamlessly with Tailwind CSS through the design tokens system. The spacing, breakpoints, and other design values are aligned with Tailwind CSS conventions, allowing for consistent styling across the application. The design tokens are structured to mirror Tailwind's configuration, making it easy to extend or customize the design system.

The integration enables developers to use Tailwind utility classes while maintaining access to the centralized design tokens for programmatic styling. This hybrid approach provides the flexibility of utility-first CSS with the consistency of a design system. Components can use Tailwind classes for layout and basic styling while accessing design tokens for dynamic styling based on theme or other context.

```mermaid
graph TB
subgraph "Design System"
Tokens[Design Tokens]
Provider[UIProviders]
end
subgraph "Styling System"
Tailwind[Tailwind CSS]
CSS[CSS Variables]
end
subgraph "Application"
Components[UI Components]
end
Tokens --> |Expose| Provider
Provider --> |Provide Context| Components
Tokens --> |Generate| CSS
Tailwind --> |Utility Classes| Components
CSS --> |Theming| Components
Components --> |Use| Tailwind
Components --> |Use| Provider
```

**Diagram sources**
- [tokens.ts](file://packages/design-system/src/theme/tokens.ts)
- [DesignSystemProvider.tsx](file://packages/design-system/src/provider/DesignSystemProvider.tsx)

**Section sources**
- [tokens.ts](file://packages/design-system/src/theme/tokens.ts)
- [DesignSystemProvider.tsx](file://packages/design-system/src/provider/DesignSystemProvider.tsx)

## Common Issues and Solutions
Several common issues arise when implementing UI providers, particularly around theme flickering during SSR hydration, responsive layout breakpoints, and accessibility considerations.

### Theme Flickering During SSR Hydration
Theme flickering occurs when the server-rendered content uses a different theme than the client's preferred theme. This is resolved by synchronizing the theme state between server and client through cookie-based theme persistence and inline theme detection scripts that prevent flash of incorrect theme (FOIT).

### Responsive Layout Breakpoints
Responsive layout issues can occur when breakpoints are not consistently applied across components. The solution is to centralize breakpoint definitions in the design tokens and use a consistent approach to responsive design throughout the application.

### Accessibility Considerations
Accessibility issues related to color contrast and font scaling are addressed by ensuring sufficient contrast ratios between text and background colors in both light and dark themes. The design system enforces minimum contrast ratios and provides scalable typography that respects user preferences for font size.

```mermaid
flowchart TD
Issue1["Theme Flickering During SSR Hydration"] --> Solution1["Store Theme Preference in Cookie"]
Solution1 --> Step1["Read Cookie on Server"]
Step1 --> Step2["Apply Theme During SSR"]
Step2 --> Step3["Synchronize Client Theme"]
Issue2["Responsive Layout Breakpoints"] --> Solution2["Centralize Breakpoint Definitions"]
Solution2 --> Step4["Use Design Tokens for Breakpoints"]
Step4 --> Step5["Implement Consistent Media Queries"]
Issue3["Accessibility: Color Contrast"] --> Solution3["Enforce Minimum Contrast Ratios"]
Solution3 --> Step6["Verify WCAG Compliance"]
Step6 --> Step7["Provide High Contrast Mode"]
Issue4["Accessibility: Font Scaling"] --> Solution4["Support User Font Preferences"]
Solution4 --> Step8["Use Relative Units (rem)"]
Step8 --> Step9["Respect Browser Font Settings"]
```

**Diagram sources**
- [DesignSystemProvider.tsx](file://packages/design-system/src/provider/DesignSystemProvider.tsx)
- [heroui.config.ts](file://packages/design-system/src/theme/heroui.config.ts)
- [tokens.ts](file://packages/design-system/src/theme/tokens.ts)

**Section sources**
- [DesignSystemProvider.tsx](file://packages/design-system/src/provider/DesignSystemProvider.tsx)
- [heroui.config.ts](file://packages/design-system/src/theme/heroui.config.ts)
- [tokens.ts](file://packages/design-system/src/theme/tokens.ts)

## Conclusion
The UIProviders component provides a robust foundation for managing presentation-layer contexts in the application. By centralizing theme management, responsive design configuration, and styling context, it ensures consistency and maintainability across all UI components. The integration with HeroUI and Tailwind CSS provides a powerful combination of utility-first styling with a structured design system. The implementation addresses common challenges such as theme flickering, responsive design, and accessibility, making it a comprehensive solution for modern web application styling.
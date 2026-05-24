import {
  forwardRef,
  type ComponentRef,
  type ComponentPropsWithoutRef,
  isValidElement,
  type ReactNode,
} from "react";
import { Text as RNText } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";
import { joinClassNames } from "../../rhythm/class-name";

const textClassNames = tv({
  base: "text-foreground",
  variants: {
    align: {
      center: "text-center",
      left: "text-left",
      right: "text-right",
    },
    tone: {
      accent: "text-accent",
      danger: "text-danger",
      foreground: "text-foreground",
      muted: "text-muted",
      success: "text-success",
      warning: "text-warning",
    },
    variant: {
      body: "text-sm leading-5",
      caption: "text-xs leading-4",
      eyebrow: "text-xs font-semibold uppercase tracking-wide leading-4",
      heading: "text-lg font-extrabold leading-7",
      label: "text-sm font-semibold leading-5",
      title: "text-base font-bold leading-6",
    },
    weight: {
      bold: "font-bold",
      extrabold: "font-extrabold",
      medium: "font-medium",
      regular: "font-normal",
      semibold: "font-semibold",
    },
  },
  defaultVariants: {
    tone: "foreground",
    variant: "body",
  },
});

export interface TextProps
  extends
    Omit<ComponentPropsWithoutRef<typeof RNText>, "className">,
    VariantProps<typeof textClassNames> {
  className?: string;
}

const TextComponent = forwardRef<ComponentRef<typeof RNText>, TextProps>(
  (props, ref) => {
    const { align, className, tone, variant, weight, ...rest } = props;
    return (
      <RNText
        {...rest}
        ref={ref}
        className={joinClassNames(
          textClassNames({
            align,
            tone,
            variant,
            weight,
          }),
          className,
        )}
      />
    );
  },
);

TextComponent.displayName = "Text";

export const Text = TextComponent;

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const collectTextParts = (node: ReactNode): string[] | null => {
  if (node === null || node === undefined || typeof node === "boolean") {
    return [];
  }

  if (typeof node === "string") {
    const value = normalizeText(node);
    return value ? [value] : [];
  }

  if (typeof node === "number") {
    return [String(node)];
  }

  if (isValidElement(node)) {
    return null;
  }

  if (Array.isArray(node)) {
    const parts: string[] = [];

    for (const child of node) {
      const childParts = collectTextParts(child);

      if (childParts === null) {
        return null;
      }

      parts.push(...childParts);
    }

    return parts;
  }

  return null;
};

export const getTextContent = (node: ReactNode): string | null => {
  const parts = collectTextParts(node);
  const content = parts?.join(" ").trim();
  return content ? content : null;
};

export const wrapTextContent = (
  node: ReactNode,
  props: Omit<TextProps, "children"> = {},
) => {
  const content = getTextContent(node);
  return content === null ? node : <Text {...props}>{content}</Text>;
};

export { textClassNames };

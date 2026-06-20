import { type ReactNode } from "react";
import {
  Text,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useFormField } from "@cocrepo/hook/useFormField";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";
import { Icon, type MobileIconName } from "../../icon";
import { PureRadio } from "../Radio";
export interface SelectableCardItem {
  description?: ReactNode;
  disabledReason?: ReactNode;
  eyebrow?: ReactNode;
  iconName?: MobileIconName;
  isDisabled?: boolean;
  meta?: readonly ReactNode[];
  tags?: readonly ReactNode[];
  title: ReactNode;
  value: string;
}
export interface PureSelectableCardListProps
  extends Omit<ViewProps, "children"> {
  cardStyle?: StyleProp<ViewStyle>;
  description?: ReactNode;
  disabled?: boolean;
  emptyContent?: ReactNode;
  emptyLabel?: ReactNode;
  items?: readonly SelectableCardItem[];
  onSelect?: (value: string) => void;
  selectLabel?: ReactNode;
  selectedCardStyle?: StyleProp<ViewStyle>;
  selectedLabel?: ReactNode;
  selectedValue?: string | null;
  title?: ReactNode;
}
interface SelectableCardConfig {
  cardStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onSelect?: (value: string) => void;
  selectLabel?: ReactNode;
  selectedCardStyle?: StyleProp<ViewStyle>;
  selectedLabel?: ReactNode;
  selectedValue?: string | null;
}
const toAccessibleText = (value: ReactNode) => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  return undefined;
};
const createSelectHandler = (
  item: SelectableCardItem,
  config: SelectableCardConfig,
) => {
  if (config.disabled || item.isDisabled) {
    return undefined;
  }
  return () => {
    config.onSelect?.(item.value);
  };
};
const NodeText = ({
  className,
  node,
}: {
  className?: string;
  node: ReactNode;
}) => {
  if (node === undefined || node === null || node === false) {
    return null;
  }
  return <Text className={className}>{node}</Text>;
};
const SelectableTag = ({ tag }: { tag: ReactNode }) => (
  <View className={classNames.tag()}>
    <Text className={classNames.tagText()}>{tag}</Text>
  </View>
);
const SelectableMeta = ({ meta }: { meta: ReactNode }) => (
  <Text className={classNames.metaText()}>{meta}</Text>
);
const SelectableTitleIcon = ({ item }: { item: SelectableCardItem }) => {
  if (!item.iconName) {
    return null;
  }
  return (
    <View className={classNames.titleIcon()}>
      <Icon name={item.iconName} size="sm" tone="accent" />
    </View>
  );
};
const SelectableTags = ({ item }: { item: SelectableCardItem }) => {
  if (!item.tags?.length) {
    return null;
  }
  return (
    <View className={classNames.tags()}>
      {item.tags.map((tag, index) => (
        <SelectableTag key={`tag-${index}`} tag={tag} />
      ))}
    </View>
  );
};
const SelectableMetaList = ({ item }: { item: SelectableCardItem }) => {
  if (!item.meta?.length) {
    return null;
  }
  return (
    <View className={classNames.meta()}>
      {item.meta.map((meta, index) => (
        <SelectableMeta key={`meta-${index}`} meta={meta} />
      ))}
    </View>
  );
};
const DisabledReasonText = ({ item }: { item: SelectableCardItem }) => {
  if (!item.isDisabled || !item.disabledReason) {
    return null;
  }
  return (
    <Text className={classNames.disabledReason()}>{item.disabledReason}</Text>
  );
};
const SelectionIndicator = ({
  config,
  isDisabled,
  isSelected,
}: {
  config: SelectableCardConfig;
  isDisabled: boolean;
  isSelected: boolean;
}) => {
  const slotClassNames = selectableCardListClassNames({
    disabled: isDisabled,
    selected: isSelected,
  });
  return (
    <View className={slotClassNames.indicator()}>
      <PureRadio.Indicator className={slotClassNames.radioIndicator()} />
      <Text className={slotClassNames.indicatorText()}>
        {isSelected
          ? (config.selectedLabel ?? "Selected")
          : (config.selectLabel ?? "Select")}
      </Text>
    </View>
  );
};
const SelectableCard = ({
  config,
  index,
  item,
}: {
  config: SelectableCardConfig;
  index: number;
  item: SelectableCardItem;
}) => {
  const isSelected = config.selectedValue === item.value;
  const isDisabled = Boolean(config.disabled || item.isDisabled);
  const slotClassNames = selectableCardListClassNames({
    disabled: isDisabled,
    selected: isSelected,
  });
  return (
    <PureRadio
      accessibilityLabel={toAccessibleText(item.title)}
      accessibilityState={{
        checked: isSelected,
        disabled: isDisabled,
        selected: isSelected,
      }}
      isDisabled={isDisabled}
      isSelected={isSelected}
      key={item.value || `selectable-card-${index}`}
      className={slotClassNames.card()}
      onPress={createSelectHandler(item, config)}
      style={[config.cardStyle, isSelected ? config.selectedCardStyle : null]}
      variant="secondary"
    >
      <View className={slotClassNames.cardHeader()}>
        <View className={slotClassNames.titleRow()} key="title">
          <SelectableTitleIcon item={item} />
          <View className={slotClassNames.titleStack()}>
            <NodeText
              className={slotClassNames.eyebrow()}
              node={item.eyebrow}
            />
            <NodeText
              className={slotClassNames.cardTitle()}
              node={item.title}
            />
          </View>
        </View>
        <View key="indicator">
          <SelectionIndicator
            config={config}
            isDisabled={isDisabled}
            isSelected={isSelected}
          />
        </View>
      </View>
      <NodeText
        className={slotClassNames.cardDescription()}
        node={item.description}
      />
      <SelectableMetaList item={item} />
      <SelectableTags item={item} />
      <DisabledReasonText item={item} />
    </PureRadio>
  );
};
const SelectableCards = ({
  config,
  items,
}: {
  config: SelectableCardConfig;
  items: readonly SelectableCardItem[];
}) => (
  <>
    {items.map((item, index) => (
      <SelectableCard
        config={config}
        index={index}
        item={item}
        key={item.value || `selectable-card-${index}`}
      />
    ))}
  </>
);
const EmptyContent = ({
  emptyContent,
  emptyLabel,
}: {
  emptyContent?: ReactNode;
  emptyLabel?: ReactNode;
}) => {
  if (emptyContent) {
    return emptyContent;
  }
  return (
    <View accessibilityRole="summary" className={classNames.empty()}>
      <Text className={classNames.emptyTitle()}>
        {emptyLabel ?? "No options available"}
      </Text>
    </View>
  );
};
const PureSelectableCardListComponent = observer(
  (props: PureSelectableCardListProps) => {
    const {
      cardStyle,
      description,
      disabled = false,
      emptyContent,
      emptyLabel,
      items = [],
      onSelect,
      selectLabel,
      selectedCardStyle,
      selectedLabel,
      selectedValue,
      style,
      title,
      ...rest
    } = props;
    const config: SelectableCardConfig = {
      cardStyle,
      disabled,
      onSelect,
      selectLabel,
      selectedCardStyle,
      selectedLabel,
      selectedValue,
    };
    return (
      <View {...rest} className={classNames.root()} style={style}>
        {title || description ? (
          <View className={classNames.heading()}>
            <NodeText className={classNames.title()} node={title} />
            <NodeText className={classNames.description()} node={description} />
          </View>
        ) : null}
        {items.length > 0 ? (
          <View className={classNames.list()}>
            <SelectableCards config={config} items={items} />
          </View>
        ) : (
          <EmptyContent emptyContent={emptyContent} emptyLabel={emptyLabel} />
        )}
      </View>
    );
  },
);
PureSelectableCardListComponent.displayName = "PureSelectableCardList";
export const PureSelectableCardList = PureSelectableCardListComponent;
export interface SelectableCardListProps<
  TState extends object = Record<string, unknown>,
> extends MobxProps<TState>,
    Omit<PureSelectableCardListProps, "onSelect" | "selectedValue"> {
  onSelect?: PureSelectableCardListProps["onSelect"];
}
const SelectableCardListComponent = observer(
  <TState extends object>(props: SelectableCardListProps<TState>) => {
    const { onSelect, path, state, ...rest } = props;
    const field = useFormField<TState, string | null>({
      path,
      state,
      value: (tools.get(state, path) ?? null) as string | null,
    });
    const handleSelect: PureSelectableCardListProps["onSelect"] = (value) => {
      field.setValue(value);
      onSelect?.(value);
    };
    return (
      <PureSelectableCardList
        {...rest}
        onSelect={handleSelect}
        selectedValue={field.state.value}
      />
    );
  },
);
SelectableCardListComponent.displayName = "SelectableCardList";
export const SelectableCardList = SelectableCardListComponent;
const selectableCardListClassNames = tv({
  slots: {
    card: "flex-col items-stretch justify-start gap-2 rounded-lg border border-border bg-surface p-4",
    cardDescription: "text-[13px] leading-5 text-muted",
    cardHeader: "flex-row items-start justify-between gap-2",
    cardTitle: "text-base font-bold leading-[22px] text-foreground",
    description: "text-[13px] leading-5 text-muted",
    disabledReason: "text-[13px] leading-[18px] text-warning",
    empty: "rounded-lg border border-border bg-surface-secondary p-4",
    emptyTitle: "text-sm leading-5 text-muted",
    eyebrow: "text-xs font-bold uppercase leading-4 text-accent",
    heading: "gap-1",
    indicator:
      "min-w-16 flex-row items-center justify-center gap-1.5 rounded-full border border-border bg-surface-secondary px-2 py-1",
    indicatorText:
      "text-xs font-bold leading-4 text-surface-secondary-foreground",
    list: "gap-2",
    meta: "flex-row flex-wrap gap-2",
    metaText: "text-[13px] leading-[18px] text-surface-foreground",
    root: "gap-3",
    radioIndicator: "size-4",
    tag: "rounded-full border border-border bg-surface-secondary px-2 py-1",
    tagText:
      "text-xs font-semibold leading-4 text-surface-secondary-foreground",
    tags: "flex-row flex-wrap gap-2",
    title: "text-base font-extrabold leading-6 text-foreground",
    titleIcon:
      "mt-0.5 h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-secondary",
    titleRow: "flex-1 flex-row items-start gap-2",
    titleStack: "flex-1 gap-1",
  },
  variants: {
    disabled: {
      false: {},
      true: {
        card: "opacity-[0.55]",
        indicator: "bg-surface-tertiary",
      },
    },
    selected: {
      false: {},
      true: {
        card: "border-accent bg-accent-soft",
        indicator: "border-accent bg-accent",
        indicatorText: "text-accent-foreground",
      },
    },
  },
  defaultVariants: {
    disabled: false,
    selected: false,
  },
});
const classNames = selectableCardListClassNames();

import { Typography } from "../../data-display/Typography";
import { Icon } from "../../icon";
import { ListGroup } from "../../layout/ListGroup";
import { quickActionListClassNames } from "./QuickActionList.class-names";
import type { QuickActionListItem } from "./QuickActionList.item";

/**
 * 빠른 이동 항목 하나를 ListGroup 행으로 렌더링합니다.
 *
 * @param item - route 또는 screen에서 전달한 빠른 이동 항목 계약
 * @returns ListGroup에 들어갈 터치 가능한 행 JSX
 */
export function renderQuickActionListItem(item: QuickActionListItem) {
	const classNames = quickActionListClassNames({
		disabled: item.disabled === true,
	});

	return (
		<ListGroup.Item
			accessibilityRole="button"
			accessibilityState={{
				disabled: item.disabled === true,
			}}
			className={classNames.item()}
			key={item.id}
			onPress={item.disabled ? undefined : item.onPress}
		>
			<ListGroup.ItemPrefix>
				<Icon name={item.iconName} size="sm" tone="accent" />
			</ListGroup.ItemPrefix>
			<ListGroup.ItemContent>
				<Typography className={classNames.label()} type="body-sm">
					{item.label}
				</Typography>
				<Typography className={classNames.description()} type="body-sm">
					{item.description}
				</Typography>
			</ListGroup.ItemContent>
			<ListGroup.ItemSuffix>
				<Icon
					className={classNames.suffix()}
					name="arrowRight"
					size="sm"
					tone="muted"
				/>
			</ListGroup.ItemSuffix>
		</ListGroup.Item>
	);
}

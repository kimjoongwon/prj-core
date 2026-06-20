import { observer } from "mobx-react-lite";
import { View } from "react-native";
import { Text } from "../../data-display/Text";
import { ListGroup } from "../../layout/ListGroup";
import { quickActionListClassNames } from "./QuickActionList.class-names";
import type { QuickActionListProps } from "./QuickActionList.props";
import { renderQuickActionListItem } from "./renderQuickActionListItem";

/**
 * 마이 페이지와 반복 진입 화면에서 쓰는 빠른 이동 목록을 렌더링합니다.
 *
 * @param props - 빠른 이동 항목과 View 컨테이너 props
 * @returns 터치 가능한 빠른 이동 목록
 */
export const QuickActionList = observer(function QuickActionList({
	items,
	...rest
}: QuickActionListProps) {
	const classNames = quickActionListClassNames();

	if (items.length === 0) {
		return (
			<View {...rest} className={classNames.empty()}>
				<Text className={classNames.emptyText()}>
					사용할 수 있는 빠른 이동이 없습니다.
				</Text>
			</View>
		);
	}

	return (
		<ListGroup {...rest} className={classNames.list()}>
			{items.map(renderQuickActionListItem)}
		</ListGroup>
	);
});

QuickActionList.displayName = "QuickActionList";

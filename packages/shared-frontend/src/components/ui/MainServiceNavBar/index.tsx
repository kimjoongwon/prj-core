import { observer } from 'mobx-react-lite';
import { MainNavBarProps } from '../../../types/components';
import { useMobxHookForm } from '../../../hooks';
import { MainServiceNavBarView } from './MainServiceNavBarView';
import { get } from 'lodash-es';
import { action } from 'mobx';

export const MainServiceNavBar = observer(
  <T extends object>(props: MainNavBarProps<T>) => {
    const { state, path = '', value, ...rest } = props;
    const initialValue = (get(state, path) as string) || value;
    const { localState } = useMobxHookForm(initialValue, state, path);

    const onClickNavBarItem = action((value: string) => {
      localState.value = value;
    });

    return (
      <MainServiceNavBarView
        value={localState.value}
        {...rest}
        onClickNavBarItem={onClickNavBarItem}
      />
    );
  },
);

import { observer } from 'mobx-react-lite';
import { get, isUndefined, set } from 'lodash-es';
import { MobxProps } from '@shared/types';
import { KeyboardEventHandler } from 'react';
import { Input } from '../Input/Input';

interface SearchProps<T> extends MobxProps<T> {
  queryState: any;
}

export const Search = observer(<T extends object>(props: SearchProps<T>) => {
  const { state, path, queryState } = props;
  if (isUndefined(state) || isUndefined(path)) {
    return null;
  }
  const onClear = () => {
    if (isUndefined(state) || isUndefined(path)) {
      return null;
    }

    set(state, path, '');
  };

  const onEnterKeyPress: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter') {
      set(queryState, path, get(state, path));
    }
  };

  return (
    <Input
      state={state}
      path={path}
      isClearable
      startContent={<div>SearchIcon</div>}
      className="w-full sm:max-w-[44%]"
      placeholder="Search by name..."
      onClear={() => onClear()}
      onKeyDown={onEnterKeyPress}
    />
  );
});

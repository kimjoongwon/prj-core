import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { cloneDeep, get } from 'lodash-es';
import React from 'react';
import { BaseAutoCompleteProps } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { useMobxHookForm } from '../../../..';

export const AutoComplete = observer(
  <T extends object>(props: BaseAutoCompleteProps<T>) => {
    const { options, state = {}, path = '', label = 'label' } = props;
    const _options = cloneDeep(options);

    const initialValue =
      _options?.find(option => option.value === get(state, path))?.value ||
      undefined;

    const { localState } = useMobxHookForm(initialValue, state, path);

    return (
      <div className="flex w-full max-w-xs flex-col gap-2">
        <Autocomplete
          label={label}
          variant="bordered"
          defaultItems={options}
          placeholder={`${label}를 검색하세요.`}
          className="max-w-xs"
          selectedKey={localState.value}
          onSelectionChange={(value: any) => (localState.value = value)}
        >
          {item => (
            <AutocompleteItem key={item.value}>{item.text}</AutocompleteItem>
          )}
        </Autocomplete>
      </div>
    );
  },
);

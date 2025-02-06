'use client';

import {
  Button as BaseButton,
  APIManager,
  ButtonViewProps,
} from '@shared/frontend';
import { CellButtonBuilder as ButtonBuilderProps } from '@shared/types';
import { PathUtil } from '@shared/utils';
import { isAxiosError } from 'axios';
import { observer } from 'mobx-react-lite';
import { cloneDeep } from 'lodash-es';
import { useRouter } from 'next/navigation';
import { Delete, Edit, List, Plus } from 'lucide-react';

interface ButtonProps extends ButtonViewProps {
  row?: unknown & { id: string };
  buttonBuilder: ButtonBuilderProps;
  icon?: React.ReactNode;
}

export const CellButtonBuilder = observer((props: ButtonProps) => {
  const { buttonBuilder, row, icon, ...rest } = props;
  const router = useRouter();

  const onPress = async () => {
    const button = cloneDeep(buttonBuilder);
    const navigator = button.navigator;

    try {
      if (button.mutation?.name) {
        // @ts-ignore
        await APIManager[button.mutation.name](row?.id);
      }

      if (button.alert) {
        console.log('success');
      }

      const pathname = PathUtil.getUrlWithParamsAndQueryString(
        navigator?.pathname || '',
        {
          rowId: row?.id,
        },
      );
      router.push(pathname);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.log('error', error);
      }
    }
  };

  let buttonChildren: any = buttonBuilder.name;

  switch (buttonBuilder.icon) {
    case 'detail':
      buttonChildren = <List />;
      break;
    case 'add':
      buttonChildren = <Plus />;
      break;
    case 'edit':
      buttonChildren = <Edit />;
      break;
    case 'delete':
      buttonChildren = <Delete />;
      break;
    default:
      buttonChildren = buttonBuilder.name;
  }

  return (
    <BaseButton
      {...rest}
      isIconOnly={true}
      onPress={onPress}
      color={buttonBuilder?.color || 'primary'}
    >
      {buttonChildren}
    </BaseButton>
  );
});

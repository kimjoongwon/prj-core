'use client';

import { Form } from '@coc/shared';
import { CategoryItemForm, FormContainer } from '@components';
import { observer } from 'mobx-react-lite';
import { useCategoryItemEditPage } from './hooks';

function CategoryItemEditPage() {
  const { form } = useCategoryItemEditPage();

  return (
    <FormContainer>
      <Form
        state={form.state}
        schema={form.schema}
        title={'카테고리 항목 생성'}
        onClickSave={form.buttons.onClickSave}
        onClickCancel={form.buttons.onClickCancel}
      >
        <CategoryItemForm state={form.state} />
      </Form>
    </FormContainer>
  );
}

export default observer(CategoryItemEditPage);

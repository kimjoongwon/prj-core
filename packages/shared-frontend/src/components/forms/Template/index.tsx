'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { TemplateFormView } from './TemplateFormView';
import { UpdateTemplateDto } from '../../../model';

interface TemplateFormProps {
  state: UpdateTemplateDto;
}

export const TemplateForm = observer((props: TemplateFormProps) => {
  const { state } = props;
  return <TemplateFormView state={state} />;
});

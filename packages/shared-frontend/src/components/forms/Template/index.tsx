'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { TemplateFormView } from './TemplateFormView';
import { TemplateDto } from '../../../model';

export interface TemplateFormProps {
  state: Partial<TemplateDto>;
}

export const TemplateForm = observer((props: TemplateFormProps) => {
  const { state } = props;
  return <TemplateFormView state={state} />;
});

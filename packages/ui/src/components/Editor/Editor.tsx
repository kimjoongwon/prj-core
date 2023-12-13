'use client';

import { useMemo } from 'react';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { MobxProps } from '../../types';
import { get } from 'lodash-es';
import { useMobxHookForm } from '../../hooks';
import { action } from 'mobx';

export interface BaseEditorProps<T> extends MobxProps<T> {}

export const BaseEditor = <T extends object>(props: BaseEditorProps<T>) => {
  const { path = '', state = {} } = props;

  const initialValue = get(state, path);

  const { localState } = useMobxHookForm(initialValue, state, path);

  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const handleChange = action((value: string) => {
    localState.value = value;
  });

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];

  return (
    <ReactQuill theme="snow" value={localState.value} onChange={handleChange} modules={modules} formats={formats} />
  );
};

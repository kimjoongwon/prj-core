import { observer } from 'mobx-react-lite';
import { useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { MobxProps } from '../types';
import { get } from 'lodash-es';
import { action } from 'mobx';
import { useMobxHookForm } from '../../../hooks';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  SourceEditing,
  HtmlEmbed,
} from 'ckeditor5';

// import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
// import { SourceEditing } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

export interface BaseEditorProps<T> extends MobxProps<T> {}

export const EditorView = observer(
  <T extends object>(props: BaseEditorProps<T>) => {
    const ref = useRef();
    const { path = '', state = {} } = props;

    const initialValue = get(state, path);

    const { localState } = useMobxHookForm(initialValue, state, path);

    const handleChange = action((value: string) => {
      localState.value = value;
    });

    return (
      <CKEditor
        editor={ClassicEditor}
        data={localState.value}
        onReady={editor => {
          // You can store the "editor" and use when it is needed.
          console.log('Editor is ready to use!', editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log({ event, editor, data });
          localState.value = data;
        }}
        onBlur={(event, editor) => {
          console.log('Blur.', editor);
        }}
        onFocus={(event, editor) => {
          console.log('Focus.', editor);
        }}
        config={{
          toolbar: {
            items: [
              'undo',
              'redo',
              '|',
              'bold',
              'italic',
              'sourceEditing',
              'htmlEmbed',
            ],
          },
          plugins: [
            Bold,
            Essentials,
            Italic,
            Mention,
            Paragraph,
            Undo,
            SourceEditing,
            HtmlEmbed,
          ],
        }}
      />
    );
  },
);

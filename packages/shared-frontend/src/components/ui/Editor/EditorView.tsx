import { observer } from 'mobx-react-lite';
import { MobxProps } from '../types';
import { get } from 'lodash-es';
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
  GeneralHtmlSupport,
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

export interface BaseEditorProps<T> extends MobxProps<T> {}

export const EditorView = observer(
  <T extends object>(props: BaseEditorProps<T>) => {
    const { path = '', state = {} } = props;

    const initialValue = get(state, path);

    const { localState } = useMobxHookForm(initialValue, state, path);

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
        onBlur={(_, editor) => {
          console.log('Blur.', editor);
        }}
        onFocus={(_, editor) => {
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
          htmlSupport: {
            allow: [
              {
                name: /.*/,
                attributes: true,
                classes: true,
                styles: true,
              },
            ],
          },
          plugins: [
            GeneralHtmlSupport,
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

'use client';

import React from 'react';
import { PostFormView } from './PostFormView';
import { PostDto } from '../../../model';
import { observer } from 'mobx-react-lite';

export interface PostFormProps {
  state: Partial<PostDto>;
}

export const PostForm = observer((props: PostFormProps) => {
  const { state } = props;
  return <PostFormView state={state} />;
});

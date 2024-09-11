'use client';

import { observer } from 'mobx-react-lite';
import React from 'react';
import { PostFormView } from './PostFormView';
import { UpdatePostDto } from '../../../model';

interface PostFormProps {
  state: UpdatePostDto;
}

export const PostForm = observer((props: PostFormProps) => {
  const { state } = props;
  return <PostFormView state={state} />;
});

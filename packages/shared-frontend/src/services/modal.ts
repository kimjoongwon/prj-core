'use client';

import { makeAutoObservable } from 'mobx';

export class ModalService {
  open = false;
  type: any;
  header?: string;
  // actions: ButtonProps[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  destory() {
    this.open = false;
    this.header = undefined;
    this.type = undefined;
  }

  build({ type, header }: Omit<ModalService, 'open' | 'destory' | 'build'>) {
    this.open = true;
    this.type = type;
    this.header = header;
  }
}

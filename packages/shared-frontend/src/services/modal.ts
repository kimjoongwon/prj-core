import { makeAutoObservable } from 'mobx';
import { ReactNode } from 'react';
import { Galaxy } from './galaxy';

export class Modal {
  galaxy: Galaxy;
  open = false;
  header?: string | ReactNode = undefined;
  body?: string | ReactNode = undefined;
  footer?: string | ReactNode = undefined;
  constructor(galaxy: Galaxy) {
    this.galaxy = galaxy;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  destory() {
    this.open = false;
    this.header = undefined;
    this.body = undefined;
    this.footer = undefined;
  }

  build({
    header,
    body,
    footer,
  }: {
    header?: string | ReactNode;
    body?: string | ReactNode;
    footer?: string | ReactNode;
  }) {
    this.open = true;
    this.header = header;
    this.body = body;
    this.footer = footer;
  }
}

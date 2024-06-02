import { makeAutoObservable } from 'mobx';
import { ReactNode } from 'react';
import { SpaceSelectModalContent } from '../components/modal/contents/SpaceSelect';
import { Button } from '../components';
import { MyUniv } from './myUniv';
import { AuthStatus } from './auth';

export class Modal {
  app: MyUniv;
  open: boolean = false;
  header: string | ReactNode | null = null;
  body: string | ReactNode | null = null;
  footer: string | ReactNode | null = null;

  constructor(app: MyUniv) {
    this.app = app;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  close() {
    this.open = false;
    this.header = null;
    this.body = null;
    this.footer = null;
  }

  openSpaceSelectModal() {
    this.open = true;
    this.body = <SpaceSelectModalContent />;
    this.footer = (
      <Button
        onClick={() => {
          this.close();
          this.app.auth.status = AuthStatus.Authenticated;
        }}
      ></Button>
    );
  }
}

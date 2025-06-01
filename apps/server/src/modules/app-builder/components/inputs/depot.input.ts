import { ElementBuilder } from '@shared/types';

export class DepotInput {
  label: string;
  setLabel(label: string) {
    this.label = label;
  }

  private getLabel() {
    return this.label;
  }

  getMeta(path: string = 'files') {
    const input: ElementBuilder = {
      name: 'Depot',
      path: path,
      props: {
        label: this.getLabel(),
        title: '썸네일',
      },
    };
    return input;
  }
}

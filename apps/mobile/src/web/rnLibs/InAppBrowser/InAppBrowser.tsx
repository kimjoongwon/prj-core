import { Serializerable } from '../../model';
import { rnNavigation } from '../../util/beforeApp';

export class InAppBrowser extends Serializerable {
  async open(url: string) {
    rnNavigation.navigate('InAppBrowser', { url });
  }
}

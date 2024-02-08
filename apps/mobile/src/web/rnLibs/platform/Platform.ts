import { OS } from '../../model';
import { storage } from '../../util/beforeApp';

export class Platform {
  private static instance: Platform;

  static getInstance(): Platform {
    if (!Platform.instance) {
      Platform.instance = new Platform();
    }
    return Platform.instance;
  }

  getOS(): OS {
    // @STORAGE
    // return localStorage.getItem('platform') as OS;
    return storage.get('platform') as OS;
  }
}

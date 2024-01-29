// @ts-ignore
import CryptoJS from 'rn-crypto-js';

export interface MultiFactor {
  enable: boolean;
  type: 'pin' | 'pattern' | 'bio' | '';
  data: string;
  salt?: CryptoJS.lib.WordArray;
}

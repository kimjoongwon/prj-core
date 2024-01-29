import {SALT} from '@constants';
// @ts-ignore
import CryptoJS from 'rn-crypto-js';

export const encryptDataForEasyLogin = (data: string) => {
  const encryptData = CryptoJS?.PBKDF2(data, SALT, {
    keySize: 512 / 32,
    iterations: 1000,
  });

  return {
    encryptData,
  };
};

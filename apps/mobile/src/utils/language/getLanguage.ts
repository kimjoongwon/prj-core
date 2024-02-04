import {getLocales} from 'react-native-localize';
import {storage} from 'src/App';

export type LanguageCode = 'ko' | 'en' | 'zh';

export const getLanguageCode = async (): Promise<LanguageCode> => {
  let defaultLang: LanguageCode = 'ko';
  const languageCodeInStorage = (await storage.get('language')) as LanguageCode;

  if (languageCodeInStorage) {
    return languageCodeInStorage;
  }
  const languageCodeInDevice = getLocales()[0].languageCode as LanguageCode;

  if (languageCodeInDevice) {
    return languageCodeInDevice;
  }

  return defaultLang;
};

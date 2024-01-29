import {translations} from '@translations';
import {LanguageCode} from '../language/getLanguage';

export const translate = (key: string, lang: LanguageCode) => {
  const translation = translations[key];

  return translation?.[lang] || key;
};

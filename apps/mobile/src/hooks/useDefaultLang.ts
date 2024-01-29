import {useEffect, useState} from 'react';
import {LanguageCode, getLanguageCode} from '@utils';

export function useDefaultLang() {
  const [defaultLang, setDefaultLang] = useState<LanguageCode>('ko');

  useEffect(() => {
    async function getDefaultLang() {
      const languageCode = await getLanguageCode();

      setDefaultLang(languageCode);
    }

    getDefaultLang();
  }, []);

  return {defaultLang};
}

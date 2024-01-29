import {useEffect, useState} from 'react';
import {storage} from 'src/App';

/**
 * storage 초기값을 셋팅하는 javascript 코드를 가져온다.
 */
export function useStorageJavascript() {
  const [storageJavascript, setStorageJavascript] = useState('');

  useEffect(() => {
    async function getStorageJavascript() {
      const res = await storage.init();

      setStorageJavascript(res);
    }
    getStorageJavascript();
  });

  return {
    storageJavascript,
  };
}

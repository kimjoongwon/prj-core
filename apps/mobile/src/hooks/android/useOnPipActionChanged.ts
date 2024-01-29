import {useEffect} from 'react';
import {platform, webviewRef} from 'src/App';
import {usePipActionListener} from 'src/libs/pipHandler';

export const usePipActionChanged = () => {
  const action = usePipActionListener();

  useEffect(() => {
    if (platform.OS() === 'android') {
      if (action === 'p_pause') {
        webviewRef.current?.injectJavaScript(
          `if (
            window.embedApi &&
            window.embedApi.playVideo
          ) {
            window.embedApi.pauseVideo();
          } else {
            console.log('mySUNI', 'no play video');
          };true;`,
        );
      }

      if (action === 'p_play') {
        webviewRef.current?.injectJavaScript(
          `if (
            window.embedApi &&
            window.embedApi.playVideo
          ) {
            window?.embedApi?.playVideo();
          } else {
            console.log('mySUNI', 'no play video');
          }true;`,
        );
      }
    }
  }, [action]);
};

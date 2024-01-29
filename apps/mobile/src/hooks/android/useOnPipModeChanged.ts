import {useEffect} from 'react';
import {platform, webviewRef} from 'src/App';
import PipHandler, {usePipModeListener} from 'src/libs/pipHandler';

export const useOnPipModeChanged = () => {
  const isPipMode = usePipModeListener();

  useEffect(() => {
    if (platform.OS() === 'android') {
      if (PipHandler.getPipEnabled()) {
        if (isPipMode) {
          webviewRef.current?.injectJavaScript(
            "document.getElementsByClassName('header')[0].style.visibility = 'hidden';document.getElementsByClassName('player_thumb')?.[0]?.classList?.add('pip');true;",
          );
        }
        if (!isPipMode) {
          webviewRef.current?.injectJavaScript(
            "document.getElementsByClassName('header')[0].style.visibility = 'visible';document.getElementsByClassName('player_thumb')?.[0]?.classList?.remove('pip');ture;",
          );
        }
      }
    }
  }, [isPipMode]);
};

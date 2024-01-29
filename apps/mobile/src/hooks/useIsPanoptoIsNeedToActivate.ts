import {useEffect, useState} from 'react';

export const useIsPanoptoIsNeedToActivate = (
  isLoggedIn: boolean,
  isPanoptoLoggedIn: boolean,
) => {
  const [isPanoptoIsNeedToActivate, setIsPanoptoIsNeedToActivate] =
    useState(false);

  useEffect(() => {
    console.log('isPanoptoLoggedIn', isPanoptoLoggedIn);
    console.log('isLoggedIn', isLoggedIn);
    if (isLoggedIn && !isPanoptoLoggedIn) {
      setIsPanoptoIsNeedToActivate(true);
    }
  }, [isLoggedIn, isPanoptoLoggedIn]);

  return {
    isPanoptoIsNeedToActivate,
  };
};

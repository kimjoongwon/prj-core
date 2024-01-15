'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import Script from 'next/script';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = (props: AuthLayoutProps) => {
  return (
    <>

      {/* <Script
        src="https://developers.panopto.com/scripts/embedapi.min.js"
        onLoad={e => alert(JSON.stringify(e))}
        onError={e =>
          alert(
            'test1' +
              JSON.stringify(e, [
                'message',
                'arguments',
                'type',
                'name',
              ]),
          )
        }
        onReady={() => alert('ready')}
      /> */}
      <div className="flex justify-center">{props.children}</div>;
    </>
  );
};

export default observer(AuthLayout);

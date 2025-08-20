'use client';
import React, { useEffect, useLayoutEffect, useMemo, useCallback } from 'react';
import { config } from './config';
import { OverlayProvider } from '@gluestack-ui/overlay';
import { ToastProvider } from '@gluestack-ui/toast';
import { setFlushStyles } from '@gluestack-ui/nativewind-utils/flush';
import { script } from './script';

export type ModeType = 'light' | 'dark' | 'system';

export interface GluestackUIProviderProps {
  mode?: ModeType;
  children?: React.ReactNode;
}

const variableStyleTagId = 'gluestack-ui-theme-variables';

const createStyle = (styleTagId: string) => {
  const style = document.createElement('style');
  style.id = styleTagId;
  style.appendChild(document.createTextNode(''));
  return style;
};

const useSafeLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function GluestackUIProvider({
  mode = 'system',
  children,
}: GluestackUIProviderProps) {
  const cssVariablesWithMode = useMemo(() => {
    let variables = '';
    Object.keys(config).forEach((configKey) => {
      variables += configKey === 'dark' ? '\n.dark {\n' : '\n:root {\n';
      const cssVariables = Object.keys(
        config[configKey as keyof typeof config]
      ).reduce((acc: string, curr: string) => {
        acc += `  ${curr}: ${config[configKey as keyof typeof config][curr]};\n`;
        return acc;
      }, '');
      variables += `${cssVariables}}\n`;
    });
    return variables;
  }, []);

  const handleMediaQuery = useCallback((e: MediaQueryListEvent) => {
    script(e.matches ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    setFlushStyles(cssVariablesWithMode);
  }, [cssVariablesWithMode]);

  useSafeLayoutEffect(() => {
    if (mode !== 'system') {
      const documentElement = document.documentElement;
      if (documentElement) {
        const oppositeMode = mode === 'light' ? 'dark' : 'light';
        documentElement.classList.remove(oppositeMode);
        documentElement.classList.add(mode);
        documentElement.style.colorScheme = mode;
      }
    }
  }, [mode]);

  useSafeLayoutEffect(() => {
    if (mode !== 'system') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    script(media.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      script(e.matches ? 'dark' : 'light');
    };

    if (media.addEventListener) {
      media.addEventListener('change', handleChange);
      return () => media.removeEventListener('change', handleChange);
    } else {
      media.addListener(handleChange);
      return () => media.removeListener(handleChange);
    }
  }, [mode]);

  useSafeLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const documentElement = document.documentElement;
    if (!documentElement) return;

    const head = documentElement.querySelector('head');
    if (!head) return;

    let style = head.querySelector(`[id='${variableStyleTagId}']`) as HTMLStyleElement;
    
    if (!style) {
      style = createStyle(variableStyleTagId);
      head.appendChild(style);
    }
    
    style.innerHTML = cssVariablesWithMode;
  }, [cssVariablesWithMode]);

  return (
    <>
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `(${script.toString()})('${mode}')`,
        }}
      />
      <OverlayProvider>
        <ToastProvider>{children}</ToastProvider>
      </OverlayProvider>
    </>
  );
}

import { useState, useEffect } from 'react';
import type { ContentView } from '@/lib/content-classification';
import siteConfig from 'virtual:veslx-config';

const STORAGE_KEY = 'veslx-content-view';

export function useContentView(): [ContentView, (view: ContentView) => void] {
  const [view, setView] = useState<ContentView>(() => {
    if (typeof window === 'undefined') return siteConfig.defaultView;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['posts', 'docs', 'all'].includes(stored)) {
      return stored as ContentView;
    }
    return siteConfig.defaultView;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, view);
  }, [view]);

  return [view, setView];
}

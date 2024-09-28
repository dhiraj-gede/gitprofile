import { LOCAL_STORAGE_KEY_NAME } from '../constants';
import { SanitizedThemeConfig } from '../interfaces/sanitized-config';

export const isDarkishTheme = (appliedTheme: string): boolean => {
  return ['dark', 'halloween', 'forest', 'black', 'luxury', 'dracula'].includes(
    appliedTheme,
  );
};
export const getInitialTheme = (themeConfig: SanitizedThemeConfig): string => {
  if (themeConfig.disableSwitch) {
    return themeConfig.defaultTheme;
  }

  if (
    typeof window !== 'undefined' &&
    !(localStorage.getItem(LOCAL_STORAGE_KEY_NAME) === null)
  ) {
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEY_NAME);

    if (savedTheme && themeConfig.themes.includes(savedTheme)) {
      return savedTheme;
    }
  }

  if (themeConfig.respectPrefersColorScheme && !themeConfig.disableSwitch) {
    return typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : themeConfig.defaultTheme;
  }

  return themeConfig.defaultTheme;
};

import { LOCAL_STORAGE_KEY_NAME } from '../constants';
import { DEFAULT_CUSTOM_THEME } from '../constants/default-custom-theme';
import { DEFAULT_THEMES } from '../constants/default-themes';
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

export const getSanitizedThemeConfig = (
  themeConfig: ThemeConfig,
): SanitizedThemeConfig => {
  return {
    defaultTheme: themeConfig?.defaultTheme || DEFAULT_THEMES[0],
    disableSwitch: themeConfig?.disableSwitch || false,
    respectPrefersColorScheme: themeConfig?.respectPrefersColorScheme || false,
    displayAvatarRing: themeConfig?.displayAvatarRing ?? true,
    themes: themeConfig?.themes || DEFAULT_THEMES,
    customTheme: {
      primary:
        themeConfig?.customTheme?.primary || DEFAULT_CUSTOM_THEME.primary,
      secondary:
        themeConfig?.customTheme?.secondary || DEFAULT_CUSTOM_THEME.secondary,
      accent: themeConfig?.customTheme?.accent || DEFAULT_CUSTOM_THEME.accent,
      neutral:
        themeConfig?.customTheme?.neutral || DEFAULT_CUSTOM_THEME.neutral,
      'base-100':
        themeConfig?.customTheme?.['base-100'] ||
        DEFAULT_CUSTOM_THEME['base-100'],
      '--rounded-box':
        themeConfig?.customTheme?.['--rounded-box'] ||
        DEFAULT_CUSTOM_THEME['--rounded-box'],
      '--rounded-btn':
        themeConfig?.customTheme?.['--rounded-btn'] ||
        DEFAULT_CUSTOM_THEME['--rounded-btn'],
    },
  };
};

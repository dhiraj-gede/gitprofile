import { DEFAULT_CUSTOM_THEME } from '../constants/default-custom-theme';
import { DEFAULT_THEMES } from '../constants/default-themes';
import { sanitizedHackerrankConfig } from '../interfaces/sanitized-config';

export const getSanitizedHackerrankConfig = (
  config: HackerrankConfig,
): sanitizedHackerrankConfig | Record<string, never> => {
  try {
    return {
      seo: {
        title: config?.seo?.title,
        description: config?.seo?.description,
        imageURL: config?.seo?.imageURL,
      },
      social: {
        linkedin: config?.social?.linkedin,
        twitter: config?.social?.twitter,
        mastodon: config?.social?.mastodon,
        facebook: config?.social?.facebook,
        instagram: config?.social?.instagram,
        reddit: config?.social?.reddit,
        threads: config?.social?.threads,
        youtube: config?.social?.youtube,
        udemy: config?.social?.udemy,
        dribbble: config?.social?.dribbble,
        behance: config?.social?.behance,
        medium: config?.social?.medium,
        dev: config?.social?.dev,
        stackoverflow: config?.social?.stackoverflow,
        website: config?.social?.website,
        phone: config?.social?.phone,
        email: config?.social?.email,
        skype: config?.social?.skype,
        telegram: config?.social?.telegram,
        researchGate: config?.social?.researchGate,
      },
      resume: {
        fileUrl: config?.resume?.fileUrl || '',
      },
      skills: config?.skills || [],
      experiences:
        config?.experiences?.filter(
          (experience) =>
            experience.company ||
            experience.position ||
            experience.from ||
            experience.to,
        ) || [],
      certifications:
        config?.certifications?.filter(
          (certification) =>
            certification.year || certification.name || certification.body,
        ) || [],
      educations:
        config?.educations?.filter(
          (item) => item.institution || item.degree || item.from || item.to,
        ) || [],
      publications: config?.publications?.filter((item) => item.title) || [],
      googleAnalytics: {
        id: config?.googleAnalytics?.id,
      },
      hotjar: {
        id: config?.hotjar?.id,
        snippetVersion: config?.hotjar?.snippetVersion || 6,
      },
      blog: {
        username: config?.blog?.username || '',
        source: config?.blog?.source || 'dev',
        limit: config?.blog?.limit || 5,
        display: !!config?.blog?.username && !!config?.blog?.source,
      },
      themeConfig: {
        defaultTheme: config?.themeConfig?.defaultTheme || DEFAULT_THEMES[0],
        disableSwitch: config?.themeConfig?.disableSwitch || false,
        respectPrefersColorScheme:
          config?.themeConfig?.respectPrefersColorScheme || false,
        displayAvatarRing: config?.themeConfig?.displayAvatarRing ?? true,
        themes: config?.themeConfig?.themes || DEFAULT_THEMES,
        customTheme: {
          primary:
            config?.themeConfig?.customTheme?.primary ||
            DEFAULT_CUSTOM_THEME.primary,
          secondary:
            config?.themeConfig?.customTheme?.secondary ||
            DEFAULT_CUSTOM_THEME.secondary,
          accent:
            config?.themeConfig?.customTheme?.accent ||
            DEFAULT_CUSTOM_THEME.accent,
          neutral:
            config?.themeConfig?.customTheme?.neutral ||
            DEFAULT_CUSTOM_THEME.neutral,
          'base-100':
            config?.themeConfig?.customTheme?.['base-100'] ||
            DEFAULT_CUSTOM_THEME['base-100'],
          '--rounded-box':
            config?.themeConfig?.customTheme?.['--rounded-box'] ||
            DEFAULT_CUSTOM_THEME['--rounded-box'],
          '--rounded-btn':
            config?.themeConfig?.customTheme?.['--rounded-btn'] ||
            DEFAULT_CUSTOM_THEME['--rounded-btn'],
        },
      },
      footer: config?.footer,
      enablePWA: config?.enablePWA ?? true,
    };
  } catch (error) {
    return {};
  }
};

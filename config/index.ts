import { NOT_FOUND_CONFIG } from './notFoundConfig';
import { GIT_CONFIG } from './gitConfig';
import { PROJECT_CONFIG } from './projectConfig';
import { SEO_CONFIG } from './seoConfig';
import { SKILL_CONFIG } from './skillConfig';
import { THEME_CONFIG } from './themeConfig';
import { INTEGRATION_CONFIG } from './integrationConfig';
import { FOOTER_CONFIG } from './footerConfig';
import { SOCIAL_CONFIG } from './socialConfig';

const CONFIG = {
  notFound: NOT_FOUND_CONFIG,
  ...GIT_CONFIG,
  github: GIT_CONFIG.github,
  projects: PROJECT_CONFIG,
  seo: SEO_CONFIG,
  social: SOCIAL_CONFIG,
  skills: SKILL_CONFIG.skills,
  integrations: INTEGRATION_CONFIG,
  footer: FOOTER_CONFIG,
  enablePWA: true,
};

export { CONFIG, THEME_CONFIG, GIT_CONFIG, SEO_CONFIG };

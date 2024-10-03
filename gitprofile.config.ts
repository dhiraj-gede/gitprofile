import { NOT_FOUND_CONFIG } from './config/notFoundConfig';
import { GIT_CONFIG } from './config/gitConfig';
import { PROJECT_CONFIG } from './config/projectConfig';
import { SEO_CONFIG } from './config/seoConfig';
import { SKILL_CONFIG } from './config/skillConfig';
import { THEME_CONFIG } from './config/themeConfig';
import { INTEGRATION_CONFIG } from './config/integrationConfig';
import { FOOTER_CONFIG } from './config/footerConfig';
import { SOCIAL_CONFIG } from './config/socialConfig';

const GitCONFIG = {
  notFound: NOT_FOUND_CONFIG,
  ...GIT_CONFIG,
  projects: PROJECT_CONFIG,
  seo: SEO_CONFIG,
  social: SOCIAL_CONFIG,
  skills: SKILL_CONFIG.skills,
  themeConfig: THEME_CONFIG,
  integrations: INTEGRATION_CONFIG,
  footer: FOOTER_CONFIG,
  enablePWA: true,
};

export default GitCONFIG;

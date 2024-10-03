import { NOT_FOUND_CONFIG } from './config/notFoundConfig';
import { SKILL_CONFIG } from './config/skillConfig';
import { THEME_CONFIG } from './config/themeConfig';
import { INTEGRATION_CONFIG } from './config/integrationConfig';
import { FOOTER_CONFIG } from './config/footerConfig';
import { SOCIAL_CONFIG } from './config/socialConfig';
import { HACKERRANK_CONFIG } from './config/hackerrankConfig';

const HackerrankCONFIG = {
  notFound: NOT_FOUND_CONFIG,
  ...HACKERRANK_CONFIG,
  social: SOCIAL_CONFIG,
  skills: SKILL_CONFIG.skills,
  themeConfig: THEME_CONFIG,
  integrations: INTEGRATION_CONFIG,
  footer: FOOTER_CONFIG,
  enablePWA: true,
};

export default HackerrankCONFIG;

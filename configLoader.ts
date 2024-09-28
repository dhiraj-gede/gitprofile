import { GIT_CONFIG } from './config/gitConfig';

const getConfig = () => {
  // Check if `window` is available (i.e., we're in a browser environment)
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;

    // Check for base paths
    if (path.startsWith('/gitprofile/')) {
      return GIT_CONFIG;
    } else {
      return {
        base: '/404',
      }; // Handle 404 or unknown paths
    }
  }

  // Fallback for non-browser environments
  return GIT_CONFIG; // Default or initial config (you can return a safe default)
};

export const CONFIG = getConfig();

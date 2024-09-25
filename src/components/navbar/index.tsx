import React, { useState } from 'react';
// import { DEFAULT_THEMES } from '../constants/default-themes';
import { SanitizedThemeConfig } from '../../interfaces/sanitized-config';
import { getInitialTheme } from '../../utils';
import ThemeChanger from '../theme-changer-navbar';

const Navbar = ({
  links,
  loading,
  themeConfig,
}: {
  links: { name: string; href: string; display: boolean }[];
  loading: boolean;
  themeConfig: SanitizedThemeConfig;
}) => {
  const [theme, setTheme] = useState<string>(getInitialTheme(themeConfig));

  // Update the document theme attribute when theme changes
  React.useEffect(() => {
    theme && document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < 3; index++) {
      array.push(
        <li key={index}>
          <span
            className="block bg-base-300 rounded w-16 h-6"
            style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
          ></span>
        </li>,
      );
    }
    return array;
  };

  return (
    <nav className="bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <a href="/" className="text-lg font-semibold text-base-content">
              MyLogo
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {!themeConfig.disableSwitch && (
              <ThemeChanger
                theme={theme}
                setTheme={setTheme}
                loading={loading}
                themeConfig={themeConfig}
              />
            )}
            <ul className="hidden sm:flex space-x-4">
              {loading
                ? renderSkeleton()
                : links.map((link, index) => {
                    return (
                      link.display && (
                        <li key={index}>
                          <a
                            href={link.href}
                            className="text-base-content opacity-70 hover:opacity-100"
                          >
                            {link.name}
                          </a>
                        </li>
                      )
                    );
                  })}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

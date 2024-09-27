import React, { useEffect, useRef, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { MdSettings, MdLogout, MdAccountCircle } from 'react-icons/md';
import { SanitizedThemeConfig } from '../../interfaces/sanitized-config';
import { getInitialTheme } from '../../utils';
import ThemeChanger from '../theme-changer-navbar';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Link } from 'react-router-dom';

const Navbar = ({
  links,
  loading,
  themeConfig,
  onLogout,
}: {
  links: { name: string; href: string; display: boolean }[];
  loading: boolean;
  themeConfig: SanitizedThemeConfig;
  onLogout: () => void;
}) => {
  const [theme, setTheme] = useState<string>(getInitialTheme(themeConfig));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, decodedToken } = useSelector(
    (state: RootState) => state.user,
  );

  // Update the document theme attribute when theme changes
  React.useEffect(() => {
    theme && document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !(event.target as HTMLElement)
        .closest('button')
        ?.matches('.flex.items-center.w-full')
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link
              to={isLoggedIn ? '/githubprofile' : '/'}
              className="text-lg font-semibold text-base-content"
            >
              {/* {isLoggedIn ? 'yse' : 'no'} */}
              MyLogo
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            {!themeConfig.disableSwitch && (
              <ThemeChanger
                theme={theme}
                setTheme={setTheme}
                loading={loading}
                themeConfig={themeConfig}
              />
            )}

            {/* Profile Section */}
            {isLoggedIn ? (
              <div className="relative flex">
                <ul className="hidden sm:flex space-x-6">
                  {links.map(
                    (link, index) =>
                      link.display && (
                        <li key={index}>
                          <Link
                            to={link.href}
                            className="text-base-content opacity-70 hover:opacity-100 px-3 py-2 rounded-lg transition-colors duration-200"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ),
                  )}
                </ul>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-base-content hover:text-opacity-80 focus:outline-none"
                >
                  <FaUserCircle className="w-6 h-6" />
                  <span>{decodedToken.name || 'Profile'}</span>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <ul className="absolute right-0 mt-2 w-48 bg-base-200 shadow-lg rounded-lg overflow-hidden">
                    <div className="border-b border-base-300" ref={dropdownRef}>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-base-content hover:bg-base-300"
                      >
                        <MdAccountCircle className="mr-2 w-5 h-5" />
                        Profile
                      </Link>
                    </div>
                    <li className="border-b border-base-300">
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-base-content hover:bg-base-300"
                      >
                        <MdSettings className="mr-2 w-5 h-5" />
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onMouseDown={onLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-base-300"
                      >
                        <MdLogout className="mr-2 w-5 h-5" />
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <ul className="flex space-x-6">
                {links.map(
                  (link, index) =>
                    link.display && (
                      <li key={index}>
                        <Link
                          to={link.href}
                          className="text-base-content opacity-70 hover:opacity-100 px-3 py-2 rounded-lg transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ),
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

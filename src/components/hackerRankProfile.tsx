import { useEffect, useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { HelmetProvider } from 'react-helmet-async';
import {
  CustomError,
  GENERIC_ERROR,
  INVALID_CONFIG_ERROR,
  setTooManyRequestError,
} from '../constants/errors';
import ErrorPage from './error-page';
import HeadTagEditor from './head-tag-editor';
import AvatarCard from './avatar-card'; // Reuse AvatarCard for displaying avatar
import DetailsCard from './details-card'; // Reuse DetailsCard for other info
import Footer from './footer';
import { BG_COLOR } from '../constants';
import { DEFAULT_THEMES } from '../constants/default-themes';
import { getInitialTheme, getSanitizedConfig, setupHotjar } from '../utils';
import { SanitizedConfig } from '../interfaces/sanitized-config';
import AboutSection from './about-card';
import QuestionComponent from './question-list';

interface HackerRankProfileData {
  username: string;
  country: string;
  school: string;
  avatar: string;
  short_bio: string;
  name: string;
  jobs_headline: string;
  linkedin_url: string;
  github_url: string;
  followers_count: number;
}

const HackerRankProfile = ({
  config,
}: {
  username: string;
  config: GitConfig;
}) => {
  const [profile, setProfile] = useState<HackerRankProfileData | null>(null);
  const [error, setError] = useState<CustomError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>(DEFAULT_THEMES[0]);
  const [sanitizedConfig] = useState<SanitizedConfig | Record<string, never>>(
    getSanitizedConfig(config),
  );

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const requestObject = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      };
      const response = await axios.get(
        `http://localhost:5000/api/profile/2`,
        requestObject,
      );
      const data = response.data.model;
      setProfile({
        username: data.username,
        country: data.country,
        school: data.school,
        avatar: data.avatar,
        short_bio: data.short_bio,
        name: data.name,
        jobs_headline: data.jobs_headline,
        linkedin_url: data.linkedin_url,
        github_url: data.github_url,
        followers_count: data.followers_count,
      });
    } catch (error) {
      handleError(error as AxiosError | Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);
  useEffect(() => {
    if (Object.keys(sanitizedConfig).length === 0) {
      setError(INVALID_CONFIG_ERROR);
    } else {
      setError(null);
      setTheme(getInitialTheme(sanitizedConfig.themeConfig));
      setupHotjar(sanitizedConfig.hotjar);
      loadProfile();
    }
  }, [sanitizedConfig, loadProfile]);

  const handleError = (error: AxiosError | Error): void => {
    console.error('Error:', error);
    if (error instanceof AxiosError && error.response) {
      if (error.response.status === 403) {
        setError(setTooManyRequestError('1000'));
      } else {
        setError(GENERIC_ERROR);
      }
    } else {
      setError(GENERIC_ERROR);
    }
  };
  useEffect(() => {
    theme && document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <HelmetProvider>
      <div className="fade-in h-screen">
        {error ? (
          <ErrorPage
            status={error.status}
            title={error.title}
            subTitle={error.subTitle}
          />
        ) : (
          <>
            <HeadTagEditor appliedTheme="light" />
            <div className={`p-4 lg:p-10 min-h-full ${BG_COLOR}`}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-box">
                <div className="col-span-1">
                  <div className="grid grid-cols-1 gap-6">
                    <AvatarCard
                      profile={profile}
                      loading={loading}
                      avatarRing={true}
                    />
                    <DetailsCard
                      profile={profile}
                      loading={loading}
                      github={{
                        username: profile?.github_url || 'dhiraj-gede',
                      }}
                      social={{ linkedin: profile?.linkedin_url }}
                    />
                    {profile && (
                      <AboutSection
                        shortBio={profile.short_bio}
                        followersCount={profile.followers_count}
                        loading={false}
                      />
                    )}
                  </div>
                </div>
                <div className="lg:col-span-2 col-span-1">
                  <div className="grid grid-cols-1 gap-6">
                    <QuestionComponent />
                  </div>
                </div>
              </div>
            </div>
            <footer
              className={`p-4 footer ${BG_COLOR} text-base-content footer-center`}
            >
              <div className="card compact bg-base-100 shadow">
                <Footer
                  content="Made with ❤️ using HackerRank API"
                  loading={loading}
                />
              </div>
            </footer>
          </>
        )}
      </div>
    </HelmetProvider>
  );
};

export default HackerRankProfile;

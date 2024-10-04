// src/components/gitprofile.tsx
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios, { AxiosError } from 'axios';
import { HelmetProvider } from 'react-helmet-async';
import '../assets/index.css';
import { getSanitizedGitConfig, setupHotjar } from '../utils';
import { SanitizedGitConfig } from '../interfaces/sanitized-config';
import ErrorPage from './error-page';
// import HeadTagEditor from './head-tag-editor';
import AvatarCard from './avatar-card';
import DetailsCard from './details-card';
import SkillCard from './skill-card';
import ExperienceCard from './experience-card';
import EducationCard from './education-card';
import CertificationCard from './certification-card';
import GithubProjectCard from './github-project-card';
import ExternalProjectCard from './external-project-card';
import BlogCard from './blog-card';
import Footer from './footer';
import { RootState } from '../store'; // Adjust this import based on your store setup
import { GithubProject } from '../interfaces/github-project';
import {
  CustomError,
  GENERIC_ERROR,
  INVALID_CONFIG_ERROR,
  INVALID_GITHUB_USERNAME_ERROR,
  setTooManyRequestError,
} from '../constants/errors';
import { formatDistance } from 'date-fns';
import { BG_COLOR } from '../constants';
import PublicationCard from './publication-card';
import { setProfile, setGithubProjects, setLoading } from '../store/userSlice';

const GitProfile = ({
  config,
}: {
  config: GitConfig;
  user: { id: number | null; name: string; email: string };
}) => {
  const dispatch = useDispatch();
  const SanitizedGitConfig = useState<
    SanitizedGitConfig | Record<string, never>
  >(getSanitizedGitConfig(config))[0];
  const { profile, githubProjects, loading } = useSelector(
    (state: RootState) => state.user,
  );

  const [error, setError] = useState<CustomError | null>(null);

  const getGithubProjects = useCallback(
    async (publicRepoCount: number): Promise<GithubProject[]> => {
      if (SanitizedGitConfig.projects.github.mode === 'automatic') {
        if (publicRepoCount === 0) {
          return [];
        }

        const excludeRepo =
          SanitizedGitConfig.projects.github.automatic.exclude.projects
            .map((project) => `+-repo:${project}`)
            .join('');

        const query = `user:${SanitizedGitConfig.github.username}+fork:${!SanitizedGitConfig.projects.github.automatic.exclude.forks}${excludeRepo}`;
        const url = `https://api.github.com/search/repositories?q=${query}&sort=${SanitizedGitConfig.projects.github.automatic.sortBy}&per_page=${SanitizedGitConfig.projects.github.automatic.limit}&type=Repositories`;

        const repoResponse = await axios.get(url, {
          headers: { 'Content-Type': 'application/vnd.github.v3+json' },
        });
        const repoData = repoResponse.data;

        return repoData.items;
      } else {
        if (SanitizedGitConfig.projects.github.manual.projects.length === 0) {
          return [];
        }
        const repos = SanitizedGitConfig.projects.github.manual.projects
          .map((project) => `+repo:${project}`)
          .join('');

        const url = `https://api.github.com/search/repositories?q=${repos}+fork:true&type=Repositories`;

        const repoResponse = await axios.get(url, {
          headers: { 'Content-Type': 'application/vnd.github.v3+json' },
        });
        const repoData = repoResponse.data;

        return repoData.items;
      }
    },
    [
      SanitizedGitConfig.github.username,
      SanitizedGitConfig.projects.github.mode,
      SanitizedGitConfig.projects.github.manual.projects,
      SanitizedGitConfig.projects.github.automatic.sortBy,
      SanitizedGitConfig.projects.github.automatic.limit,
      SanitizedGitConfig.projects.github.automatic.exclude.forks,
      SanitizedGitConfig.projects.github.automatic.exclude.projects,
    ],
  );
  // useEffect(() => {
  //   console.log('sending dispatch for loading: ');
  //   dispatch(setLoading(true));
  // }, []);

  const loadData = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const requestObject = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      };
      const response = await axios.get(
        `http://localhost:5000/api/profile/1`,
        requestObject,
      );
      const data = response.data;
      console.log('pro', {
        avatar: data.avatar_url,
        name: data.name || ' ',
        bio: data.bio || '',
        location: data.location || '',
        company: data.company || '',
      });
      dispatch(
        setProfile({
          avatar: data.avatar_url,
          name: data.name || ' ',
          bio: data.bio || '',
          location: data.location || '',
          company: data.company || '',
        }),
      );

      if (SanitizedGitConfig.projects.github.display) {
        const projects = await getGithubProjects(data.public_repos);
        dispatch(setGithubProjects(projects));
      }
    } catch (error: AxiosError | unknown) {
      handleError(error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, SanitizedGitConfig.projects.github.display, getGithubProjects]);

  useEffect(() => {
    if (Object.keys(SanitizedGitConfig).length === 0) {
      setError(INVALID_CONFIG_ERROR);
    } else {
      setError(null);
      setupHotjar(SanitizedGitConfig.hotjar);
      loadData();
    }
  }, [SanitizedGitConfig, loadData]);

  const handleError = (error: AxiosError | Error | unknown): void => {
    if (error instanceof AxiosError) {
      try {
        const reset = formatDistance(
          new Date(error.response?.headers?.['x-ratelimit-reset'] * 1000),
          new Date(),
          { addSuffix: true },
        );

        if (typeof error.response?.status === 'number') {
          switch (error.response.status) {
            case 403:
              setError(setTooManyRequestError(reset));
              break;
            case 404:
              setError(INVALID_GITHUB_USERNAME_ERROR);
              break;
            default:
              setError(GENERIC_ERROR);
              break;
          }
        } else {
          setError(GENERIC_ERROR);
        }
      } catch (innerError) {
        setError(GENERIC_ERROR);
      }
    } else {
      setError(GENERIC_ERROR);
    }
  };

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
            {/* <HeadTagEditor
              googleAnalyticsId={SanitizedGitConfig.googleAnalytics.id}
              appliedTheme={theme}
            /> */}
            <div className={`p-4 lg:p-10 min-h-full ${BG_COLOR}`}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-box">
                <div className="col-span-1">
                  <div className="grid grid-cols-1 gap-6">
                    <AvatarCard
                      profile={profile}
                      loading={loading}
                      avatarRing={
                        SanitizedGitConfig.themeConfig.displayAvatarRing
                      }
                      resumeFileUrl={SanitizedGitConfig.resume.fileUrl}
                    />
                    <DetailsCard
                      profile={profile}
                      loading={loading}
                      github={SanitizedGitConfig.github}
                      social={SanitizedGitConfig.social}
                    />
                    {SanitizedGitConfig.skills.length !== 0 && (
                      <SkillCard
                        loading={loading}
                        skills={SanitizedGitConfig.skills}
                      />
                    )}
                    {SanitizedGitConfig.experiences.length !== 0 && (
                      <ExperienceCard
                        loading={loading}
                        experiences={SanitizedGitConfig.experiences}
                      />
                    )}
                    {SanitizedGitConfig.certifications.length !== 0 && (
                      <CertificationCard
                        loading={loading}
                        certifications={SanitizedGitConfig.certifications}
                      />
                    )}
                    {SanitizedGitConfig.educations.length !== 0 && (
                      <EducationCard
                        loading={loading}
                        educations={SanitizedGitConfig.educations}
                      />
                    )}
                  </div>
                </div>
                <div className="lg:col-span-2 col-span-1">
                  <div className="grid grid-cols-1 gap-6">
                    {SanitizedGitConfig.projects.github.display && (
                      <GithubProjectCard
                        header={SanitizedGitConfig.projects.github.header}
                        limit={
                          SanitizedGitConfig.projects.github.automatic.limit
                        }
                        githubProjects={githubProjects}
                        loading={loading}
                        username={SanitizedGitConfig.github.username}
                        googleAnalyticsId={
                          SanitizedGitConfig.googleAnalytics.id
                        }
                      />
                    )}
                    {SanitizedGitConfig.publications.length !== 0 && (
                      <PublicationCard
                        loading={loading}
                        publications={SanitizedGitConfig.publications}
                      />
                    )}
                    {SanitizedGitConfig.projects.external.projects.length !==
                      0 && (
                      <ExternalProjectCard
                        loading={loading}
                        header={SanitizedGitConfig.projects.external.header}
                        externalProjects={
                          SanitizedGitConfig.projects.external.projects
                        }
                        googleAnalyticId={SanitizedGitConfig.googleAnalytics.id}
                      />
                    )}
                    {SanitizedGitConfig.blog.display && (
                      <BlogCard
                        loading={loading}
                        googleAnalyticsId={
                          SanitizedGitConfig.googleAnalytics.id
                        }
                        blog={SanitizedGitConfig.blog}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {SanitizedGitConfig.footer && (
              <footer
                className={`p-4 footer ${BG_COLOR} text-base-content footer-center`}
              >
                <div className="card compact bg-base-100 shadow">
                  <Footer
                    content={SanitizedGitConfig.footer}
                    loading={loading}
                  />
                </div>
              </footer>
            )}
          </>
        )}
      </div>
    </HelmetProvider>
  );
};

export default GitProfile;

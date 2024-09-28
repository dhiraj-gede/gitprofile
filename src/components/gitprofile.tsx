// src/components/gitprofile.tsx
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios, { AxiosError } from 'axios';
import { HelmetProvider } from 'react-helmet-async';
import '../assets/index.css';
import { getSanitizedGitConfig, setupHotjar } from '../utils';
import { SanitizedConfig } from '../interfaces/sanitized-config';
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
  const sanitizedConfig = useState<SanitizedConfig | Record<string, never>>(
    getSanitizedGitConfig(config),
  )[0];
  const { profile, githubProjects, loading } = useSelector(
    (state: RootState) => state.user,
  );

  const [error, setError] = useState<CustomError | null>(null);

  const getGithubProjects = useCallback(
    async (publicRepoCount: number): Promise<GithubProject[]> => {
      if (sanitizedConfig.projects.github.mode === 'automatic') {
        if (publicRepoCount === 0) {
          return [];
        }

        const excludeRepo =
          sanitizedConfig.projects.github.automatic.exclude.projects
            .map((project) => `+-repo:${project}`)
            .join('');

        const query = `user:${sanitizedConfig.github.username}+fork:${!sanitizedConfig.projects.github.automatic.exclude.forks}${excludeRepo}`;
        const url = `https://api.github.com/search/repositories?q=${query}&sort=${sanitizedConfig.projects.github.automatic.sortBy}&per_page=${sanitizedConfig.projects.github.automatic.limit}&type=Repositories`;

        const repoResponse = await axios.get(url, {
          headers: { 'Content-Type': 'application/vnd.github.v3+json' },
        });
        const repoData = repoResponse.data;

        return repoData.items;
      } else {
        if (sanitizedConfig.projects.github.manual.projects.length === 0) {
          return [];
        }
        const repos = sanitizedConfig.projects.github.manual.projects
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
      sanitizedConfig.github.username,
      sanitizedConfig.projects.github.mode,
      sanitizedConfig.projects.github.manual.projects,
      sanitizedConfig.projects.github.automatic.sortBy,
      sanitizedConfig.projects.github.automatic.limit,
      sanitizedConfig.projects.github.automatic.exclude.forks,
      sanitizedConfig.projects.github.automatic.exclude.projects,
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

      if (sanitizedConfig.projects.github.display) {
        const projects = await getGithubProjects(data.public_repos);
        dispatch(setGithubProjects(projects));
      }
    } catch (error: AxiosError | unknown) {
      handleError(error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, sanitizedConfig.projects.github.display, getGithubProjects]);

  useEffect(() => {
    if (Object.keys(sanitizedConfig).length === 0) {
      setError(INVALID_CONFIG_ERROR);
    } else {
      setError(null);
      setupHotjar(sanitizedConfig.hotjar);
      loadData();
    }
  }, [sanitizedConfig, loadData]);

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
              googleAnalyticsId={sanitizedConfig.googleAnalytics.id}
              appliedTheme={theme}
            /> */}
            <div className={`p-4 lg:p-10 min-h-full ${BG_COLOR}`}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-box">
                <div className="col-span-1">
                  <div className="grid grid-cols-1 gap-6">
                    <AvatarCard
                      profile={profile}
                      loading={loading}
                      avatarRing={sanitizedConfig.themeConfig.displayAvatarRing}
                      resumeFileUrl={sanitizedConfig.resume.fileUrl}
                    />
                    <DetailsCard
                      profile={profile}
                      loading={loading}
                      github={sanitizedConfig.github}
                      social={sanitizedConfig.social}
                    />
                    {sanitizedConfig.skills.length !== 0 && (
                      <SkillCard
                        loading={loading}
                        skills={sanitizedConfig.skills}
                      />
                    )}
                    {sanitizedConfig.experiences.length !== 0 && (
                      <ExperienceCard
                        loading={loading}
                        experiences={sanitizedConfig.experiences}
                      />
                    )}
                    {sanitizedConfig.certifications.length !== 0 && (
                      <CertificationCard
                        loading={loading}
                        certifications={sanitizedConfig.certifications}
                      />
                    )}
                    {sanitizedConfig.educations.length !== 0 && (
                      <EducationCard
                        loading={loading}
                        educations={sanitizedConfig.educations}
                      />
                    )}
                  </div>
                </div>
                <div className="lg:col-span-2 col-span-1">
                  <div className="grid grid-cols-1 gap-6">
                    {sanitizedConfig.projects.github.display && (
                      <GithubProjectCard
                        header={sanitizedConfig.projects.github.header}
                        limit={sanitizedConfig.projects.github.automatic.limit}
                        githubProjects={githubProjects}
                        loading={loading}
                        username={sanitizedConfig.github.username}
                        googleAnalyticsId={sanitizedConfig.googleAnalytics.id}
                      />
                    )}
                    {sanitizedConfig.publications.length !== 0 && (
                      <PublicationCard
                        loading={loading}
                        publications={sanitizedConfig.publications}
                      />
                    )}
                    {sanitizedConfig.projects.external.projects.length !==
                      0 && (
                      <ExternalProjectCard
                        loading={loading}
                        header={sanitizedConfig.projects.external.header}
                        externalProjects={
                          sanitizedConfig.projects.external.projects
                        }
                        googleAnalyticId={sanitizedConfig.googleAnalytics.id}
                      />
                    )}
                    {sanitizedConfig.blog.display && (
                      <BlogCard
                        loading={loading}
                        googleAnalyticsId={sanitizedConfig.googleAnalytics.id}
                        blog={sanitizedConfig.blog}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {sanitizedConfig.footer && (
              <footer
                className={`p-4 footer ${BG_COLOR} text-base-content footer-center`}
              >
                <div className="card compact bg-base-100 shadow">
                  <Footer content={sanitizedConfig.footer} loading={loading} />
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

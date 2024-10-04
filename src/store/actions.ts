import { GithubProject } from '../interfaces/github-project';
import { Profile } from '../interfaces/profile';

// src/store/actions.ts
export const SET_PROFILE = 'SET_PROFILE';
export const SET_GITHUB_PROJECTS = 'SET_GITHUB_PROJECTS';
export const SET_LOADING = 'SET_LOADING';

export const setProfile = (profile: Profile) => ({
  type: SET_PROFILE,
  payload: profile,
});

export const setGithubProjects = (projects: GithubProject[]) => ({
  type: SET_GITHUB_PROJECTS,
  payload: projects,
});

export const setLoading = (loading: boolean) => ({
  type: SET_LOADING,
  payload: loading,
});

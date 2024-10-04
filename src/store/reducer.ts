// src/store/reducer.ts
import { GithubProject } from '../interfaces/github-project';
import { Profile } from '../interfaces/profile';
import { SET_PROFILE, SET_GITHUB_PROJECTS, SET_LOADING } from './actions';

const initialState = {
  profile: null,
  githubProjects: [],
  loading: false,
};
export interface ProfileAction {
  type: string;
  payload: Profile;
}
export interface GithubProjectsAction {
  type: string;
  payload: GithubProject[];
}
export interface LoadingAction {
  type: string;
  payload: boolean;
}

type Action = LoadingAction | ProfileAction | GithubProjectsAction;

const reducer = (state = initialState, action: Action) => {
  console.log('action', action);
  switch (action.type) {
    case SET_PROFILE:
      return { ...state, profile: action.payload };
    case SET_GITHUB_PROJECTS:
      return { ...state, githubProjects: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export default reducer;

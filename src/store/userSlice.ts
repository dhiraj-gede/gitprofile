// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DecodedToken } from '../main';
import { GithubProject } from '../interfaces/github-project';
import { Profile } from '../interfaces/profile';

interface UserState {
  profile: Profile | null;
  githubProjects: GithubProject[]; // Adjust the type as necessary
  loading: boolean;
  isLoggedIn: boolean;
  decodedToken: DecodedToken;
}

const initialState: UserState = {
  profile: null,
  githubProjects: [],
  loading: false,
  isLoggedIn: false,
  decodedToken: { email: '', name: '', id: null, exp: null },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Profile>) {
      console.log('profile', action);
      state.profile = action.payload;
    },
    setGithubProjects(state, action: PayloadAction<GithubProject[]>) {
      // Adjust the type as necessary
      console.log('project', action);
      state.githubProjects = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      console.log('Loading', action);
      state.loading = action.payload;
    },
    login: (state, action: PayloadAction<DecodedToken>) => {
      console.log('login', action);
      state.isLoggedIn = true;
      state.decodedToken = action.payload;

      // Store token in sessionStorage
      const token = sessionStorage.getItem('token');
      if (!token) {
        const encodedToken = JSON.stringify(action.payload); // Assuming you pass the token in decoded form
        sessionStorage.setItem('token', encodedToken);
      }
    },
    logout: (state) => {
      console.log('logout', state);
      state.isLoggedIn = false;
      state.decodedToken = { email: '', name: '', id: null, exp: null };

      // Remove token from sessionStorage
      sessionStorage.removeItem('token');
    },
  },
});

export const { setProfile, setGithubProjects, setLoading, login, logout } =
  userSlice.actions;
export default userSlice.reducer;

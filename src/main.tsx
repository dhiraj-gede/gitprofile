import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correcting the import for jwtDecode
import GitProfile from './components/gitprofile.tsx';
import HackerRankProfile from './components/hackerRankProfile.tsx';
import Navbar from './components/navbar/index.tsx';
import LoginForm from './components/auth/LoginForm/index.tsx';
import SignupForm from './components/auth/SignupForm/index.tsx';
import LandingPage from './components/landing-page/index.tsx';
import ActionLayout from './components/action-layout/index.tsx';
import NotFoundPage from './components/NotFound.tsx';
import PrivateRoute from './components/HOCs/PrivateRoute/index.tsx';
import { SanitizedThemeConfig } from './interfaces/sanitized-config.tsx';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store, { RootState } from './store/index.ts';
import { login, logout } from './store/userSlice.ts';
import { getSanitizedThemeConfig } from './utils/theme.tsx';
import { THEME_CONFIG } from '../config/themeConfig.ts';

export interface DecodedToken {
  email: string;
  name: string;
  id: number | null;
  exp: number | null;
}

export const App = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, decodedToken } = useSelector(
    (state: RootState) => state.user,
  );

  const [themeConfig] = useState<SanitizedThemeConfig>(
    getSanitizedThemeConfig(THEME_CONFIG),
  );

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          // Token has expired, log the user out
          sessionStorage.removeItem('token');
          dispatch(logout());
        } else {
          // Token is valid, update the state with user info
          dispatch(login(token));
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        sessionStorage.removeItem('token');
        dispatch(logout());
      }
    }
  }, [dispatch]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    dispatch(logout());
    navigate('/home');
  };

  return (
    <div className="min-h-screen">
      <Navbar
        links={[
          { name: 'Code', href: 'code', display: isLoggedIn },
          { name: 'Git', href: 'githubprofile', display: isLoggedIn },
          { name: 'HackerRank', href: 'hackerrank', display: isLoggedIn },
          { name: 'Login', href: 'login', display: !isLoggedIn },
          { name: 'Signup', href: 'signup', display: !isLoggedIn },
        ]}
        themeConfig={themeConfig}
        loading={false}
        onLogout={handleLogout}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/" element={<LandingPage />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route
            path="/githubprofile"
            element={<GitProfile config={GIT_CONFIG} user={decodedToken} />}
          />
          <Route
            path="/hackerrank"
            element={
              <HackerRankProfile username="dhirajgede" config={GIT_CONFIG} />
            }
          />
          <Route path="/code" element={<ActionLayout />} />
        </Route>

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);

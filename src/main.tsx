import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import GitProfile from './components/gitprofile.tsx';
import NotFoundPage from './components/NotFound.tsx';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import HackerRankProfile from './components/hackerRankProfile.tsx';
import Navbar from './components/navbar/index.tsx';
import { SanitizedConfig } from './interfaces/sanitized-config.tsx';
import { getSanitizedConfig } from './utils/index.tsx';
import LoginForm from './components/auth/LoginForm/index.tsx';
import SignupForm from './components/auth/SignupForm/index.tsx';
import { jwtDecode } from 'jwt-decode';
import LandingPage from './components/landing-page/index.tsx';
interface DecodedToken {
  // Define the shape of your decoded JWT payload here
  email: string;
  name: string;
  id: number | null;
  // Add any other claims present in your token
}

export const App = () => {
  const [sanitizedConfig] = useState<SanitizedConfig | Record<string, never>>(
    getSanitizedConfig(GIT_CONFIG),
  );
  const [decodedToken, setDecodedToken] = useState<DecodedToken>({
    id: null,
    name: '',
    email: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setDecodedToken(decoded);
        setIsLoggedIn(true);
      } catch (error) {
        navigate('/home');
        console.error('Error decoding token:', error);
      }
    }
  }, []);
  return (
    <div className="min-h-screen">
      <Navbar
        links={[
          { name: 'Git', href: 'githubprofile', display: isLoggedIn },
          { name: 'HackerRank', href: 'hackerrank', display: isLoggedIn },
          { name: 'Login', href: 'login', display: isLoggedIn },
          { name: 'Signup', href: 'signup', display: isLoggedIn },
        ]}
        themeConfig={sanitizedConfig.themeConfig}
        loading={false}
      />
      <Routes>
        <Route
          path="/githubprofile"
          element={<GitProfile config={GIT_CONFIG} user={decodedToken} />}
        />
        <Route
          path="/hackerRank"
          element={
            <HackerRankProfile username="dhirajgede" config={GIT_CONFIG} />
          }
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<NotFoundPage />} />{' '}
        {/* Catch-all route for 404 */}
      </Routes>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

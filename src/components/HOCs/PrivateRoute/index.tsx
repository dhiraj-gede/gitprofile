import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const PrivateRoute: React.FC = () => {
  const { isLoggedIn, decodedToken } = useSelector(
    (state: RootState) => state.user,
  );
  const currentTime = Math.floor(Date.now() / 1000); // Current time in Unix format (seconds)

  const [showOutlet, setShowOutlet] = useState<boolean>(false);
  const [delayComplete, setDelayComplete] = useState<boolean>(false);

  useEffect(() => {
    console.log('isLoggedIn', isLoggedIn);

    if (!isLoggedIn || (decodedToken?.exp && decodedToken.exp <= currentTime)) {
      // If user is not logged in or token is expired, delay the redirection
      setTimeout(() => {
        setDelayComplete(true);
      }, 2000); // 2-second delay (adjust as necessary)
    } else {
      setShowOutlet(true); // User is logged in and token is valid, show protected content
    }
  }, [isLoggedIn, decodedToken, currentTime]);

  // Show outlet (protected routes) when user is authenticated and token is valid
  if (showOutlet) {
    return <Outlet />;
  }

  // After delay, navigate to login
  if (delayComplete) {
    return <Navigate to="/login" replace />;
  }

  // Optionally, show a loading spinner or message during the delay
  return <div>Loading...</div>;
};

export default PrivateRoute;

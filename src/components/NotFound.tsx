import { Link } from 'react-router-dom'; // Optional, for navigation in React Router

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-2xl font-semibold text-gray-600">
          Oops! Page not found
        </p>
        <p className="mt-2 text-lg text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-6">
          <Link
            to="/githubprofile" // Change this to your home route or another valid route
            className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 font-semibold rounded-lg shadow-md"
          >
            Go to GitHub Profile
          </Link>
        </div>

        <div className="mt-2">
          {/* <Link
            to="/contact" // Optional additional link
            className="px-4 py-2 text-blue-500 hover:underline"
          >
            Contact Us
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

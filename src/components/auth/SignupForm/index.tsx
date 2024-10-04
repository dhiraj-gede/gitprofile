import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

interface SignupFormProps {}

const SignupForm: React.FC<SignupFormProps> = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/signup',
        {
          name,
          email,
          password,
        },
      );

      // Save token in session storage
      sessionStorage.setItem('token', response.data.token);

      // Navigate to login or profile page
      navigate('/login'); // Adjust this route as needed
    } catch (err) {
      setError('Signup failed. Try again.');
    }
  };

  return (
    <div className="card overflow-visible shadow-lg compact bg-base-100 min-h-screen flex items-center justify-center">
      <div className="card  border border-opacity-50 border-gray-300 shadow-2xl rounded-xl max-w-lg w-full p-10 relative z-10">
        <h2 className="card-title text-center text-3xl font-bold text-base-content opacity-70">
          Sign Up
        </h2>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full mt-4 normal-case"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-base-content opacity-70">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;

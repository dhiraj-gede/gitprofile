import axios from 'axios';
import React, { useState } from 'react';
import { AiOutlineLogin } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../../store/userSlice';

export default function LoginCard() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/auth/login',
        { email, password },
      );

      sessionStorage.setItem('token', response.data.token);
      dispatch(login(response.data.token));

      navigate('/code'); // Adjust this route as needed
    } catch (err) {
      setError('Invalid login credentials');
    }
  };
  return (
    <div className="card  border border-opacity-50 border-gray-300 shadow-2xl rounded-xl max-w-lg w-full p-10 relative z-10 ">
      <h2 className="card-title text-center text-4xl font-extrabold text-base-content opacity-90 mb-4">
        Log In
      </h2>
      {error && (
        <p className="text-red-500 text-center font-semibold mb-4">{error}</p>
      )}
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg">Email</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full py-3 rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg">Password</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full py-3 rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full mt-4 py-3 flex items-center justify-center space-x-2 rounded-lg text-lg font-semibold hover:shadow-lg hover:bg-blue-600 transition-all duration-300 ease-in-out"
        >
          <AiOutlineLogin className="w-6 h-6" />
          <span>Log In</span>
        </button>
      </form>
      <p className="mt-4 text-center text-base-content text-opacity-70">
        Don’t have an account?{' '}
        <Link
          to="/signup"
          className="text-blue-500 hover:underline transition-all"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}

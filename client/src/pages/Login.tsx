import { useState, type FormEvent, type ChangeEvent } from 'react';

import { useNavigate, Navigate } from 'react-router-dom';

import axios from 'axios';

import { login } from '../services/authService';

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (localStorage.getItem('token')) {
    return <Navigate to="/dashboard" replace />;
  }

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

  };

  // Handle login form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    setLoading(true);
    setError('');

    try {

      const response = await login(formData);

      // Store authentication details
      localStorage.setItem('token', response.token);

      localStorage.setItem(
        'admin',
        JSON.stringify(response.admin)
      );

      // Redirect to dashboard
      navigate('/dashboard', { replace: true });

    } catch (error) {

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      setError(message || 'Login failed. Please try again.');

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="container-fluid min-vh-100 bg-light d-flex justify-content-center align-items-center">

      <div className="card border-0 shadow-sm p-4" style={{ width: '100%', maxWidth: '420px' }}>

        <div className="text-center mb-4">

          <p className="text-secondary mb-3">
            Login to manage job applications
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">

            <label className="form-label">
              Username
            </label>

            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />

          </div>

          <div className="mb-3">

            <label className="form-label">
              Password
            </label>

            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />

          </div>

          {error && (
            <div className="alert alert-danger py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;
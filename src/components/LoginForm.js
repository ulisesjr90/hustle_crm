"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebaseClient';
import Link from 'next/link';

const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { email, password } = formData;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to dashboard after successful login
      router.push('/dashboard');
    } catch (error) {
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            setError('Invalid email or password. Please try again.');
            break;
          case 'auth/too-many-requests':
            setError('Too many failed login attempts. Please try again later.');
            break;
          default:
            setError('An unexpected error occurred. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6">
        <h2 className="text-4xl font-bold text-center">Log in to Hustle CRM</h2>
        
        {error && <p className="text-red-500" aria-live="assertive">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-4">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-4">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <Link href="/signup" className="text-yellow-500 hover:text-yellow-400 font-bold">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
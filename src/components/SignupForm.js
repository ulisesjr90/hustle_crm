"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { auth } from '../lib/firebaseClient';
import Link from 'next/link';

// Reusable InputField component to reduce repetition
const InputField = ({ id, type = "text", value, onChange, label, disabled }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium mb-4">{label}</label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      className="input input-bordered w-full"
      disabled={disabled}
      required
    />
  </div>
);

const SignupForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    accountType: 'solo',
    mapPreference: 'Google Maps',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { name, email, password, accountType, mapPreference } = formData;
    const role = accountType === 'solo' ? 'salesperson' : accountType;

    try {
      console.log('Attempting to create user with:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created successfully in Firebase:', user.uid);

      // Proceed to create user in database
      const response = await fetch('/api/auth/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          email,
          name,
          role,
          mapPreference,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        // Delete user from Firebase if database creation fails
        await deleteUser(user);
        throw new Error(`Error creating user in database: ${errorText}`);
      }

      const result = await response.json();
      console.log('User created successfully in database:', result);

      router.push('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      setError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6">
        <h2 className="text-4xl font-bold text-center">Sign Up for Hustle CRM</h2>
        <p className="text-center text-lg">
          Start your 14-day free trial today! After that, choose between the Solo or Sales Manager plan.
        </p>

        {/* Display error messages */}
        {error && (
          <p className="text-red-500 bg-red-100 border border-red-500 rounded-md p-2 mt-4" aria-live="assertive">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <InputField
            id="name"
            value={formData.name}
            onChange={handleChange}
            label="Name"
            disabled={loading}
          />

          <InputField
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            label="Email"
            disabled={loading}
          />

          <InputField
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            label="Password"
            disabled={loading}
          />

          <div>
            <label htmlFor="accountType" className="block text-sm font-medium mb-4">Account Type</label>
            <select
              id="accountType"
              value={formData.accountType}
              onChange={handleChange}
              className="select select-bordered w-full"
              disabled={loading}
            >
              <option value="solo">Solo</option>
              <option value="sales_manager">Sales Manager</option>
            </select>
          </div>

          <div>
            <label htmlFor="mapPreference" className="block text-sm font-medium mb-4">Map Preference</label>
            <select
              id="mapPreference"
              value={formData.mapPreference}
              onChange={handleChange}
              className="select select-bordered w-full mb-2"
              disabled={loading}
            >
              <option value="Google Maps">Google Maps</option>
              <option value="Apple Maps">Apple Maps</option>
            </select>
          </div>

          {/* Button with loading state */}
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? (
              <span>
                <svg
                  className="animate-spin h-5 w-5 mr-3 inline-block text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Signing up...
              </span>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-yellow-500 hover:text-yellow-400 font-bold">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;

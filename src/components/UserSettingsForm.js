'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function UserSettingsForm() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    mapPreference: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUserData = async (uid) => {
    try {
      const response = await fetch(`/api/user?uid=${uid}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || '',
          mapPreference: userData.mapPreference || 'Google Maps',
        });
      } else {
        setError('Failed to fetch user data');
      }
    } catch (error) {
      setError('Error fetching user data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, uid: user.uid }),
      });
      if (response.ok) {
        // Optionally, show a success message
        router.push('/dashboard');
      } else {
        setError('Failed to update user settings');
      }
    } catch (error) {
      setError('Error updating user settings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            disabled
          />
        </div>
        <div>
          <label htmlFor="role" className="block mb-1">Role</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="mapPreference" className="block mb-1">Map Preference</label>
          <select
            id="mapPreference"
            name="mapPreference"
            value={formData.mapPreference}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Google Maps">Google Maps</option>
            <option value="Apple Maps">Apple Maps</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Save Changes
        </button>
      </form>
    </div>
  );
}
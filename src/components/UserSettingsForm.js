"use client"; // Ensure this component runs on the client-side

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For routing
import { auth, reauthenticateWithCredential, EmailAuthProvider } from '../lib/firebase'; // Correct Firebase imports
import axios from 'axios';  // For API calls

const UserSettingsForm = ({ onClose }) => {
  const [user, setUser] = useState(null);  // Firebase user
  const [mapPreference, setMapPreference] = useState('Google Maps');
  const [theme, setTheme] = useState('light');
  const [syncCalendar, setSyncCalendar] = useState(false);
  const [reminderTime, setReminderTime] = useState('1 hour');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [plan, setPlan] = useState(''); // Plan state for user's current plan
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState(''); // For re-authentication
  const [confirmDelete, setConfirmDelete] = useState(false); // Confirmation for delete account
  const [showDeleteWarning, setShowDeleteWarning] = useState(false); // Toggle delete warning visibility

  const router = useRouter();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setEmail(currentUser.email);  // Get email from Firebase
      const uid = currentUser.uid;  // Firebase UID

      // Fetch user preferences and other data (like name, plan) from MySQL
      fetchUserData(uid);
    }
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const response = await axios.get(`/api/user?uid=${uid}`);  // Adjust the API endpoint if needed
      if (response.status === 200) {
        const userData = response.data;
        setName(userData.name);  // Set user's name from MySQL
        setPlan(userData.role);  // Set user's plan from MySQL (role field for plan)
        setMapPreference(userData.mapPreference || 'Google Maps');
        setTheme(userData.theme || 'light');
        setSyncCalendar(userData.syncCalendar || false);
        setReminderTime(userData.reminderTime || '1 hour');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const currentUser = auth.currentUser;

      // Re-authenticate the user if email or password is being updated
      if (currentPassword) {
        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword); // Ensure correct use of EmailAuthProvider
        await reauthenticateWithCredential(currentUser, credential);
      }

      if (email !== currentUser.email || password) {
        // Update email or password in Firebase
        if (email !== currentUser.email) {
          await currentUser.updateEmail(email);
        }
        if (password) {
          await currentUser.updatePassword(password);
        }
      }

      // Update user preferences in MySQL
      const uid = currentUser.uid;
      await axios.post(`/api/user/update`, {
        uid,
        mapPreference,
        theme,
        syncCalendar,
        reminderTime,
      });

      alert('Settings updated successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(`Failed to save settings: ${error.message}`);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (!currentPassword) {
        alert('Please enter your current password to confirm account deletion.');
        return;
      }

      const currentUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential); // Re-authenticate user
      
      // Soft delete the account by updating the deleted state in MySQL
      const uid = currentUser.uid;
      await axios.post(`/api/user/delete`, { uid });

      alert('Your account has been deactivated. Please contact support to reactivate or request full deletion.');
      router.push('/'); // Redirect user to the homepage after deletion
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account.');
    }
  };

  const handleBillingAndPlanChanges = () => {
    router.push('/billing'); // Redirect to billing and plan change page
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Personalize Your Experience</h2>
      <p className="mb-6">Account for: {name || 'User'}</p>  {/* Display the user's name */}
      <p className="mb-4">Current Plan: {plan === 'sales_manager' ? 'Sales Manager' : 'Solo'}</p>  {/* Display the user's plan */}

      {/* Map Preference */}
      <div className="mb-4">
        <label className="block text-gray-400 mb-1">Preferred Map Service:</label>
        <select
          value={mapPreference}
          onChange={(e) => setMapPreference(e.target.value)}
          className="w-full p-2 bg-gray-700 text-white rounded-lg"
        >
          <option value="Google Maps">Google Maps</option>
          <option value="Apple Maps">Apple Maps</option>
        </select>
      </div>

      {/* Theme Toggle */}
      <div className="mb-4">
        <label className="block text-gray-400 mb-1">Choose your theme:</label>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">Light Mode</span>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            className="toggle toggle-info"
            onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
          <span className="text-gray-400">Dark Mode</span>
        </div>
      </div>

      {/* Sync Appointments */}
      <div className="mb-4">
        <label className="block text-gray-400 mb-1">Sync Appointments to Calendar:</label>
        <input
          type="checkbox"
          checked={syncCalendar}
          onChange={() => setSyncCalendar(!syncCalendar)}
          className="ml-2"
        />
      </div>

      {/* Appointment Reminder Time */}
      <div className="mb-4">
        <label className="block text-gray-400 mb-1">Appointment Reminder Time:</label>
        <select
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          className="w-full p-2 bg-gray-700 text-white rounded-lg"
        >
          <option value="1 hour">1 hour before</option>
          <option value="30 mins">30 mins before</option>
          <option value="15 mins">15 mins before</option>
          <option value="on time">On time</option>
        </select>
      </div>

      {/* Update Email */}
      <div className="mb-4">
        <label className="block text-gray-400 mb-1">Update Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-gray-700 text-white rounded-lg"
          placeholder="Enter your email"
        />
      </div>

      {/* Current Password */}
      <div className="mb-4">
        <label className="block text-gray-400 mb-1">Current Password:</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full p-2 bg-gray-700 text-white rounded-lg"
          placeholder="Current Password (required for changes)"
        />
      </div>

      {/* New Password */}
      <div className="mb-4">
        <label className="block text-gray-400 mb-1">New Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 bg-gray-700 text-white rounded-lg"
          placeholder="New Password"
        />
      </div>

      {/* Billing and Plan Changes Button */}
      <div className="mb-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
          onClick={handleBillingAndPlanChanges}
        >
          Billing and Plan Changes
        </button>
      </div>

      {/* Save Button */}
      <div className="flex justify-between">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={handleSaveChanges}>
          Save Changes
        </button>
      </div>

      {/* Delete Account Hyperlink */}
      <div className="mt-6">
        <button className="text-red-600 underline" onClick={() => setShowDeleteWarning(true)}>
          Delete Account
        </button>
      </div>

      {/* Show Warning on Click */}
      {showDeleteWarning && (
        <div className="mt-4 p-4 border border-red-600 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-bold text-red-600">Warning</h3>
          <p className="text-gray-400 mt-2">
            Deleting your account will permanently deactivate it. To reactivate, contact us at support@hustlecrm.io 
            For full account deletion, including email removal from the system, you will need to contact support directly.
          </p>
          {/* Delete Confirmation */}
          <div className="flex items-center my-4">
            <input
              type="checkbox"
              checked={confirmDelete}
              onChange={() => setConfirmDelete(!confirmDelete)}
              className="mr-2"
            />
            <span className="text-gray-400">I understand I am deleting my account.</span>
          </div>
          <button
            className={`bg-red-600 text-white px-4 py-2 rounded-lg ${!confirmDelete ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleDeleteAccount}
            disabled={!confirmDelete}
          >
            Delete My Account
          </button>
        </div>
      )}
    </div>
  );
};

export default UserSettingsForm;

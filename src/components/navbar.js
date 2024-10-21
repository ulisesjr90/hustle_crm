import React, { useState } from 'react';
import Link from 'next/link'; // Import Link for navigation
import Modal from './modal'; 
import Settings from './UserSettingsForm'; 
import { auth } from '../lib/firebase'; 
import { FaUser } from 'react-icons/fa';

const Navbar = ({ user }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openSettingsModal = () => {
    setIsSettingsOpen(true);
  };

  const closeSettingsModal = () => {
    setIsSettingsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          {/* Link Hustle CRM to Home */}
          <Link href="/" className="text-xl font-bold text-gray-800">Hustle CRM</Link>

          {user ? (
            <div className="flex items-center space-x-4 sm:space-x-6">
              <button
                onClick={openSettingsModal}
                className="flex items-center space-x-2 bg-gray-200 p-2 rounded-full"
              >
                <FaUser className="text-gray-800" size={18} />
                <span>{user.name ? user.name[0].toUpperCase() : 'U'}</span>
              </button>

              <button
                onClick={handleLogout}
                className="text-gray-800 hover:text-gray-600 font-medium"
              >
                Log Out
              </button>
            </div>
          ) : (
            // Show Login button when user is not authenticated
            <Link href="/login" className="text-gray-800 hover:text-gray-600 font-medium">
              Log In
            </Link>
          )}
        </div>
      </nav>

      <Modal isOpen={isSettingsOpen} onClose={closeSettingsModal}>
        <Settings onClose={closeSettingsModal} />
      </Modal>
    </>
  );
};

export default Navbar;

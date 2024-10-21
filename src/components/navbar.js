'use client';

import Link from 'next/link';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const Navbar = ({ user }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          Hustle CRM
        </Link>
        <div>
          {user ? (
            <>
              <button onClick={handleLogout} className="text-gray-800 hover:text-gray-600 mr-4">
                Log Out
              </button>
              <button className="bg-gray-200 p-2 rounded-full">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-800 hover:text-gray-600 mr-4">
                Login
              </Link>
              <Link href="/signup" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
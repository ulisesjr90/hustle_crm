'use client'; // Ensure this component runs on the client-side

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from './navbar';
import Footer from './footer';
import AddLeadForm from './AddLeadForm'; 

export default function DashboardContent() {
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser.uid);
        fetchLeads(currentUser.uid);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUserData = async (uid) => {
    try {
      const response = await fetch(`/api/user?uid=${uid}`);
      if (response.ok) {
        const userData = await response.json();
        setUser((prev) => ({ ...prev, ...userData }));
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchLeads = async (uid) => {
    try {
      const response = await fetch(`/api/leads?userId=${uid}`);
      if (response.ok) {
        const leadsData = await response.json();
        setLeads(leadsData);
      } else {
        console.error('Failed to fetch leads');
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar user={user} />
      <main className="flex-grow container mx-auto px-2 md:px-4 py-8 max-w-xl">
        {leads.length === 0 ? (
          <EmptyDashboard user={user} openModal={() => setIsModalOpen(true)} />
        ) : (
          <LeadsList leads={leads} />
        )}
      </main>
      <Footer />
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <AddLeadForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyDashboard({ user, openModal }) {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name || 'User'}</h1>
      <h2 className="text-5xl font-extrabold mb-8">Let's start hustling</h2>
      <button
        onClick={openModal}
        className="bg-red-600 text-white px-6 py-3 rounded-lg text-xl font-semibold hover:bg-red-700 transition duration-300"
      >
        Add New Lead
      </button>
    </div>
  );
}

function LeadsList({ leads }) {
  return (
    <div>
      <LeadsHeader />
      <SearchBar />
      <LeadsGrid leads={leads} />
    </div>
  );
}

function LeadsHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Leads</h1>
      <div className="flex space-x-2">
        <button className="bg-gray-200 px-4 py-2 rounded-lg">Map</button>
        <button className="bg-gray-200 px-4 py-2 rounded-lg">Street</button>
        <button className="bg-white px-4 py-2 rounded-lg shadow">Leads</button>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
    </div>
  );
}

function LeadsGrid({ leads }) {
  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <LeadCard key={lead.id} lead={lead} />
      ))}
    </div>
  );
}

function LeadCard({ lead }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
      <div>
        <h3 className="font-bold">{lead.leadName}</h3>
        <p>{lead.owner.name}</p>
        <p>{lead.address}</p>
        <p className="text-gray-500">Updated {new Date(lead.updatedAt).toLocaleString()}</p>
      </div>
      <div className="text-right">
        <p className="text-gray-500">{lead.distance} mi</p>
      </div>
    </div>
  );
}

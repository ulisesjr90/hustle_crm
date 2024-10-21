'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase'; 
import { getCurrentAddress } from '../lib/googleMaps'; 

export default function AddLeadForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    target: '',
    leadName: '',
    ownerId: '',
    assignedToId: '',
    sharedWithId: '',
    address: '',
    phone: '',
    email: '',
    currentStatus: 'new',
    appointmentDate: '',
    priority: '',
    inShopSince: '',
    insulator: false,
    notes: '',
  });
  
  const [showInShopSince, setShowInShopSince] = useState(false); 
  const [showAppointmentField, setShowAppointmentField] = useState(false); 
  const router = useRouter();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    });

    // Show/hide relevant fields based on status selection
    if (id === 'currentStatus') {
      setShowInShopSince(value === 'in shop');
      setShowAppointmentField(value === 'appointment'); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ownerId: user.uid, 
          assignedToId: formData.assignedToId || user.uid, 
        }),
      });

      if (response.ok) {
        router.push('/leads');
        onClose(); // Close the modal after successfully adding the lead
      } else {
        console.error('Failed to create lead');
      }
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  if (!isOpen) return null; // Close modal if not open

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
<div className="bg-gray-900 p-6 rounded-lg shadow-md overflow-auto max-w-sm w-full max-h-[90vh] relative"> {/* Adjusted to max-w-sm for a narrower width */}
<button onClick={onClose} className="absolute top-2 right-2 text-white text-xl">X</button> {/* Close button */}
        <h1 className="text-2xl font-bold mb-6 text-center">Add New Lead</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target Field */}
          <div>
            <label htmlFor="target" className="block text-sm font-medium mb-4">Target</label>
            <input
              type="text"
              id="target"
              value={formData.target}
              onChange={handleChange}
              className="input input-bordered w-full bg-gray-800 text-white"
              required
            />
          </div>

          {/* Lead Name */}
          <div>
            <label htmlFor="leadName" className="block text-sm font-medium mb-4">Lead Name</label>
            <input
              type="text"
              id="leadName"
              value={formData.leadName}
              onChange={handleChange}
              className="input input-bordered w-full bg-gray-800 text-white"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-4">Address</label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={handleChange}
              className="input input-bordered w-full bg-gray-800 text-white mb-4"
            />
            <button type="button" onClick={getCurrentAddress} className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg ">
              Use Current Address
            </button>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-4">Phone</label>
            <input
              type="text"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input input-bordered w-full bg-gray-800 text-white"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-4">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full bg-gray-800 text-white"
            />
          </div>

          {/* Current Status */}
          <div>
            <label htmlFor="currentStatus" className="block text-sm font-medium mb-4">Current Status</label>
            <select
              id="currentStatus"
              value={formData.currentStatus}
              onChange={handleChange}
              className="select select-bordered w-full bg-gray-800 text-white"
            >
              <option value="new">New</option>
              <option value="follow up">Follow Up</option>
              <option value="appointment">Appointment</option>
              <option value="no answer">No Answer</option>
              <option value="waiting on insurance/client">Waiting on Insurance/Client</option>
              <option value="not interested">Not Interested</option>
              <option value="in shop">In Shop</option>
            </select>
          </div>

          {/* Conditional Fields */}
          {showInShopSince && (
            <div>
              <label htmlFor="inShopSince" className="block text-sm font-medium">In Shop Since</label>
              <input
                type="date"
                id="inShopSince"
                value={formData.inShopSince}
                onChange={handleChange}
                className="input input-bordered w-full bg-gray-800 text-white"
              />
            </div>
          )}

          {showAppointmentField && (
            <div>
              <label htmlFor="appointmentDate" className="block text-sm font-medium">Appointment Date</label>
              <input
                type="datetime-local"
                id="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                className="input input-bordered w-full bg-gray-800 text-white"
              />
              <a href={generateGoogleCalendarLink()} className="mt-2 text-blue-500">Add to Google Calendar</a>
            </div>
          )}

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium mb-4">Priority</label>
            <select
              id="priority"
              value={formData.priority}
              onChange={handleChange}
              className="select select-bordered w-full bg-gray-800 text-white"
            >
              <option value="">None</option>
              <option value="low">Low</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Insulator */}
          <div>
            <label htmlFor="insulator" className="block text-sm font-medium mb-4">Insulator</label>
            <input
              type="checkbox"
              id="insulator"
              checked={formData.insulator}
              onChange={handleChange}
              className="checkbox"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-4">Notes</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={handleChange}
              className="textarea textarea-bordered w-full bg-gray-800 text-white"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full">
            Add Lead
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';

export default function LeadsList() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    // Fetch leads from your API
    async function fetchLeads() {
      try {
        const response = await fetch('/api/leads');
        if (response.ok) {
          const data = await response.json();
          setLeads(data);
        }
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    }

    fetchLeads();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Recent Leads</h2>
      <ul className="space-y-2">
        {leads.map((lead) => (
          <li key={lead.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">{lead.leadName}</h3>
            <p>{lead.email}</p>
            <p>Status: {lead.currentStatus}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
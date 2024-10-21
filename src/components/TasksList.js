'use client';

import React, { useState, useEffect } from 'react';

export default function TasksList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks from your API
    async function fetchTasks() {
      try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }

    fetchTasks();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Upcoming Tasks</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">{task.description}</h3>
            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
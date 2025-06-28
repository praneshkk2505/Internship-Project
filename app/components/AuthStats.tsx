'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type AuthStatsType = {
  date: string;
  logins: number;
  registrations: number;
};

export default function AuthStats() {
  const [stats, setStats] = useState<AuthStatsType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this from your backend
    const fetchStats = () => {
      try {
        // For demo purposes, we'll use localStorage
        const storedStats = localStorage.getItem('authStats');
        if (storedStats) {
          setStats(JSON.parse(storedStats));
        } else {
          // Initialize with some demo data
          const demoData = generateDemoData();
          localStorage.setItem('authStats', JSON.stringify(demoData));
          setStats(demoData);
        }
      } catch (error) {
        console.error('Error fetching auth stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const generateDemoData = (): AuthStatsType[] => {
    const data: AuthStatsType[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      data.push({
        date: dateStr.split('-').reverse().join('-'),
        logins: Math.floor(Math.random() * 50) + 10,
        registrations: Math.floor(Math.random() * 20) + 2,
      });
    }
    
    return data;
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading statistics...</div>;
  }

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Authentication Statistics (Last 7 Days)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="logins" fill="#F59E0B" name="Logins" />
            <Bar dataKey="registrations" fill="#10B981" name="Registrations" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-amber-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Total Logins</p>
          <p className="text-2xl font-bold text-amber-600">
            {stats.reduce((sum, day) => sum + day.logins, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Total Registrations</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.reduce((sum, day) => sum + day.registrations, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

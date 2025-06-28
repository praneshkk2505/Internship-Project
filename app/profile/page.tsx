'use client';

import { User, Mail, Phone, MapPin, Clock, Calendar, Edit, LogOut } from 'lucide-react';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import AuthStats from '../components/AuthStats';
import Navbar from '../components/Navbar';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
    router.push('/auth/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gradient-to-r from-amber-300 to-blue-300 rounded w-1/3"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gradient-to-r from-amber-300 to-yellow-300 rounded w-1/2"></div>
              <div className="h-6 bg-gradient-to-r from-amber-300 to-yellow-300 rounded w-3/4"></div>
              <div className="h-6 bg-gradient-to-r from-amber-300 to-yellow-300 rounded w-5/6"></div>
              <div className="h-6 bg-gradient-to-r from-amber-300 to-yellow-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-amber-500 p-4 shadow-md">
        <h1 className="text-xl font-bold gradient-to-r from-amber-300 to-blue-300 text-center">Profile</h1>
      </header>

      <main className="p-4 pb-20 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-amber-600" />
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                <div className="space-x-2">
                  <button
                    onClick={() => router.push('/profile/edit')}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-1.5" />
                    Logout
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Last Login</p>
                  <p className="font-medium">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Recently'}
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Address</p>
                <p className="font-medium">{user.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Statistics */}
        <AuthStats />
        <Navbar />
      </main>
    </div>
  );
}
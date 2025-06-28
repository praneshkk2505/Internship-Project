'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import toast from 'react-hot-toast';
import Navbar from './Navbar';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  // const { logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // const handleLogout = () => {
  //   logout();
  //   toast.success('Successfully logged out');
  //   router.push('/auth/login');
  // };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    // Only add event listener if dropdown is open
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  // Don't show navigation on auth pages
  const isAuthPage = pathname.startsWith('/auth');
  if (isAuthPage) return null;

  // Top bar for auth buttons
  const TopAuthBar = () => (
    <div className="fixed top-0 left-0 right-0 bg-white/90 rounded-xl backdrop-blur-sm z-40 border-b border-gray-100">
      <div className="container mx-auto px-2 rounded-xl py-1 flex justify-center">
      <div className="container mx-auto px-4 rounded-xl text-center mb-6 mt-5">
          <h1 className="text-2xl md:text-4xl font-extrabold rounded-xl leading-tight">
            <span className="bg-clip-text text-transparent rounded-xl bg-gradient-to-r from-yellow-300 to-amber-400">Chrunchy Tamizhan</span>
          </h1>
    </div>
      </div>
    </div>
  );

  return (
    <>
      <TopAuthBar />
      
      <Navbar />
    </>
  );
}
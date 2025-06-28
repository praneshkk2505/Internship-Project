'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, ShoppingCart, Search, User, LogOut, LogIn, ChevronDown, Sparkles } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
    router.push('/auth/login');
  };

  const isActive = (path: string) => pathname === path;

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
    <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-40 border-b border-gray-100">
      <div className="container mx-auto px-2 py-2 flex justify-end">
        {!isAuthenticated && !isLoading && (
          <div className="flex items-center space-x-3">
            <Link 
              href="/auth/login" 
              className="px-4 py-1.5 text-sm font-medium text-purple-700 hover:text-purple-900 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/register" 
              className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg hover:opacity-90 transition-opacity shadow-md"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <TopAuthBar />
      <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 flex justify-center items-center p-3 z-30 max-w-md w-auto mx-auto space-x-0">
        <Link 
          href="/" 
          className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${isActive('/') ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <div className="flex items-center space-x-1">
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1 font-medium">Home</span>
          </div>
        </Link>
        <Link 
          href="/search" 
          className={`p-2 rounded-xl transition-all duration-300 ${isActive('/search') ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Link>
        
        <Link 
          href="/cart" 
          className={`relative p-2 rounded-xl transition-all duration-300 ${isActive('/cart') ? 'bg-gradient-to-br from-amber-500 to-pink-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          aria-label="Shopping Cart"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">0</span>
        </Link>
        
        {isLoading ? (
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
        ) : isAuthenticated ? (
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center p-1.5 rounded-xl transition-all duration-300 ${isProfileOpen ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              aria-expanded={isProfileOpen}
              aria-haspopup="true"
              aria-label="User menu"
            >
              <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0) || <User className="h-4 w-4" />}
              </div>
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-200 ${isProfileOpen ? 'transform rotate-180' : ''}`} />
            </button>
            
            {isProfileOpen && (
              <div 
                className="absolute right-0 bottom-full mb-2 w-56 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl py-2 z-50 border border-white/20 overflow-hidden"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
                style={{
                  // Ensure it's above the bottom navigation
                  bottom: 'calc(100% + 0.5rem)'
                }}
              >
                <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50">
                  <p className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-600 truncate">{user?.email || ''}</p>
                </div>
                
                <Link 
                  href="/profile" 
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 flex items-center"
                  onClick={() => setIsProfileOpen(false)}
                  role="menuitem"
                >
                  <User className="h-4 w-4 mr-2 text-purple-500" />
                  <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-medium">Profile</span>
                </Link>
                
                <Link 
                  href="/orders" 
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 flex items-center"
                  onClick={() => setIsProfileOpen(false)}
                  role="menuitem"
                >
                  <div className="flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-2 text-gray-500" />
                    My Orders
                  </div>
                </Link>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center mt-1"
                  role="menuitem"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="font-medium">Sign out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link 
            href="/auth/login" 
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg hover:opacity-90 transition-opacity"
          >
            Sign In
          </Link>
        )}
      
    </nav>
    </>
  );
}
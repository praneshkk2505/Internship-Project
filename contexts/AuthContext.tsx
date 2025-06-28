'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type UserType = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  lastLogin?: string;
  accountCreated?: string;
  role?: string;
};

type AuthContextType = {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<UserType, 'id' | 'lastLogin' | 'accountCreated' | 'role'> & { password: string }) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate a simple ID for demo purposes
const generateId = () => Math.random().toString(36).substr(2, 9);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user from localStorage', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Track login statistics
  const trackLogin = (email: string) => {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // Get existing stats or initialize
      const statsStr = localStorage.getItem('authStats') || '[]';
      let stats = [];
      try {
        stats = JSON.parse(statsStr);
      } catch (e) {
        console.error('Failed to parse auth stats', e);
      }
      
      // Find or create today's entry
      let todayStat = stats.find((s: any) => s.date === today);
      if (!todayStat) {
        // If we have more than 7 days, remove the oldest
        if (stats.length >= 7) {
          stats.shift();
        }
        todayStat = { date: today, logins: 0, registrations: 0 };
        stats.push(todayStat);
      }
      
      todayStat.logins += 1;
      localStorage.setItem('authStats', JSON.stringify(stats));
      
      // Update user's last login
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user) {
        user.lastLogin = now.toISOString();
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      }
    } catch (error) {
      console.error('Failed to track login', error);
    }
  };

  // Track registration statistics
  const trackRegistration = (email: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get existing stats or initialize
      const statsStr = localStorage.getItem('authStats') || '[]';
      let stats = [];
      try {
        stats = JSON.parse(statsStr);
      } catch (e) {
        console.error('Failed to parse auth stats', e);
      }
      
      // Find or create today's entry
      let todayStat = stats.find((s: any) => s.date === today);
      if (!todayStat) {
        // If we have more than 7 days, remove the oldest
        if (stats.length >= 7) {
          stats.shift();
        }
        todayStat = { date: today, logins: 0, registrations: 0 };
        stats.push(todayStat);
      }
      
      todayStat.registrations += 1;
      localStorage.setItem('authStats', JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to track registration', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) return false;
    
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo, check if user exists in localStorage
      const usersStr = localStorage.getItem('users') || '[]';
      const users = JSON.parse(usersStr);
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        // Remove password before storing in state
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        setUser(userWithoutPassword);
        trackLogin(email);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<UserType, 'id' | 'lastLogin' | 'accountCreated' | 'role'> & { password: string }): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo, check if user already exists
      const usersStr = localStorage.getItem('users') || '[]';
      const users = JSON.parse(usersStr);
      
      if (users.some((u: any) => u.email === userData.email)) {
        return false; // User already exists
      }
      
      // Create new user
      const newUser = {
        id: generateId(),
        ...userData,
        role: 'user',
        lastLogin: new Date().toISOString(),
        accountCreated: new Date().toISOString(),
      };
      
      // Store user (with password) in users array
      users.push({
        ...newUser,
        password: userData.password // Store hashed password in a real app
      });
      
      localStorage.setItem('users', JSON.stringify(users));
      
      // Set current user (without password)
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      // Track registration
      trackRegistration(userData.email);
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

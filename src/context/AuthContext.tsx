
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/types/habit';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('habitUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // For demo purposes, we'll mock a successful login
    // In a real app, this would be an API call
    const mockUser: User = {
      id: '1',
      name: 'Demo User',
      email: email
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store user in localStorage
    localStorage.setItem('habitUser', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const signup = async (name: string, email: string, password: string) => {
    // For demo purposes, we'll mock a successful signup
    // In a real app, this would be an API call
    const mockUser: User = {
      id: '1',
      name: name,
      email: email
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store user in localStorage
    localStorage.setItem('habitUser', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('habitUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

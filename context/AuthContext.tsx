
import React, { createContext, useContext, useEffect, useState } from 'react';

interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  loginAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_USER: MockUser = {
  uid: 'guest_123',
  email: 'guest@breaktheloop.edu',
  displayName: 'Guest Student',
  photoURL: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(() => {
    const saved = localStorage.getItem('btl_mock_auth');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const loginAsGuest = () => {
    setUser(GUEST_USER);
    localStorage.setItem('btl_mock_auth', JSON.stringify(GUEST_USER));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('btl_mock_auth');
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, loginAsGuest }}>
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

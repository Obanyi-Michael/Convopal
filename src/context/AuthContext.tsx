import React, { createContext, ReactNode, useContext, useState } from 'react';

interface SignupData {
  fullName: string;
  country: string;
  phone: string;
  password: string;
}

interface AuthContextType {
  signupData: SignupData;
  setSignupData: (data: SignupData) => void;
  clearSignupData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [signupData, setSignupDataState] = useState<SignupData>({
    fullName: '',
    country: '',
    phone: '',
    password: '',
  });

  const setSignupData = (data: SignupData) => {
    setSignupDataState(data);
  };

  const clearSignupData = () => {
    setSignupDataState({
      fullName: '',
      country: '',
      phone: '',
      password: '',
    });
  };

  return (
    <AuthContext.Provider value={{ signupData, setSignupData, clearSignupData }}>
      {children}
    </AuthContext.Provider>
  );
}; 
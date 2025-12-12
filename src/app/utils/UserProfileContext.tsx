import React, { ReactNode, createContext, useContext, useState } from 'react';

export type UserProfile = 'AI Admin' | 'AI Engineer' | 'cluster-admin' | 'end-user';

interface UserProfileContextType {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider: React.FunctionComponent<UserProfileProviderProps> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    // Load from localStorage if available, otherwise default to 'AI Engineer'
    const saved = localStorage.getItem('userProfile');
    // Migrate old "Data Scientist" value to "end-user"
    if (saved === 'Data Scientist') {
      localStorage.setItem('userProfile', 'end-user');
      return 'end-user';
    }
    // Migrate old "Cluster Administrator" value to "cluster-admin"
    if (saved === 'Cluster Administrator') {
      localStorage.setItem('userProfile', 'cluster-admin');
      return 'cluster-admin';
    }
    return (saved as UserProfile) || 'AI Engineer';
  });

  // Runtime migration: check and update if old value exists
  React.useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved === 'Data Scientist') {
      localStorage.setItem('userProfile', 'end-user');
      setUserProfile('end-user');
    } else if (saved === 'Cluster Administrator') {
      localStorage.setItem('userProfile', 'cluster-admin');
      setUserProfile('cluster-admin');
    }
  }, []);

  const handleSetUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', profile);
  };

  return (
    <UserProfileContext.Provider value={{ userProfile, setUserProfile: handleSetUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFirebase, HelpRequest } from './FirebaseContext';

interface AppContextType {
  pendingRequests: HelpRequest[];
  resolvedRequests: HelpRequest[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const firebase = useFirebase();
  const [pendingRequests, setPendingRequests] = useState<HelpRequest[]>([]);
  const [resolvedRequests, setResolvedRequests] = useState<HelpRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const pending = await firebase.getPendingRequests();
      const resolved = await firebase.getResolvedRequests();
      setPendingRequests(pending);
      setResolvedRequests(resolved);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    // Set up real-time listener for requests
    const unsubscribe = firebase.subscribeToRequests((requests) => {
      setPendingRequests(requests.filter(req => req.status === 'pending'));
      setResolvedRequests(requests.filter(req => req.status !== 'pending'));
    });
    
    return () => unsubscribe();
  }, []);

  const value = {
    pendingRequests,
    resolvedRequests,
    isLoading,
    refreshData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import RequestCard from '../components/requests/RequestCard';
import { RefreshCw } from 'lucide-react';

const PendingRequests: React.FC = () => {
  const firebase = useFirebase();
  const { pendingRequests, isLoading, refreshData } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pending Requests</h1>
        <Button 
          variant="outline" 
          leftIcon={<RefreshCw className="w-4 h-4" />}
          onClick={handleRefresh}
          isLoading={isRefreshing}
        >
          Refresh
        </Button>
      </div>
      
      {pendingRequests.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No pending requests at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pendingRequests.map((request) => (
            <RequestCard 
              key={request.id} 
              request={request} 
              onResolve={firebase.resolveRequest}
              onMarkUnresolved={firebase.markRequestAsUnresolved}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingRequests;
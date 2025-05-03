import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Button from '../components/ui/Button';
import RequestCard from '../components/requests/RequestCard';
import { RefreshCw } from 'lucide-react';

const ResolvedRequests: React.FC = () => {
  const { resolvedRequests, isLoading, refreshData } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }
  
  // Sort resolved first, then unresolved
  const sortedRequests = [...resolvedRequests].sort((a, b) => {
    // First sort by status (resolved first)
    if (a.status === 'resolved' && b.status !== 'resolved') return -1;
    if (a.status !== 'resolved' && b.status === 'resolved') return 1;
    
    // Then by date (newest first)
    return b.updatedAt.seconds - a.updatedAt.seconds;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Resolved Requests</h1>
        <Button 
          variant="outline" 
          leftIcon={<RefreshCw className="w-4 h-4" />}
          onClick={handleRefresh}
          isLoading={isRefreshing}
        >
          Refresh
        </Button>
      </div>
      
      {sortedRequests.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No resolved requests yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sortedRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResolvedRequests;
import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { HelpCircle, CheckCircle, XCircle, Layers, BarChart3 } from 'lucide-react';
import RequestCard from '../components/requests/RequestCard';

const Dashboard: React.FC = () => {
  const { pendingRequests, resolvedRequests, isLoading } = useApp();
  
  const resolvedCount = resolvedRequests.filter(req => req.status === 'resolved').length;
  const unresolvedCount = resolvedRequests.filter(req => req.status === 'unresolved').length;
  const totalRequests = pendingRequests.length + resolvedRequests.length;
  
  // Calculate resolution rate
  const resolutionRate = totalRequests > 0 
    ? Math.round((resolvedCount / totalRequests) * 100) 
    : 0;
  
  // Get latest pending request
  const latestPendingRequest = pendingRequests[0];
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Requests</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingRequests.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <HelpCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-3xl font-bold text-emerald-600">{resolvedCount}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Unresolved</p>
              <p className="text-3xl font-bold text-red-600">{unresolvedCount}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Resolution Rate</p>
              <p className="text-3xl font-bold text-blue-600">{resolutionRate}%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-yellow-600" />
            Latest Pending Request
          </h2>
          
          {latestPendingRequest ? (
            <RequestCard request={latestPendingRequest} />
          ) : (
            <Card className="p-6 text-center text-gray-500">
              <p>No pending requests</p>
            </Card>
          )}
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            System Status
          </h2>
          
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">System Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <p className="font-medium text-emerald-600">Operational</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Average Response Time</p>
                <p className="font-medium">2.5 minutes</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Last System Update</p>
                <p className="font-medium">Today at 8:00 AM</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
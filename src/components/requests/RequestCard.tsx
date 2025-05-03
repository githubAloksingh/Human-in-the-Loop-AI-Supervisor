import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { HelpRequest } from '../../context/FirebaseContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Phone, Clock } from 'lucide-react';

interface RequestCardProps {
  request: HelpRequest;
  onResolve?: (id: string, response: string) => Promise<void>;
  onMarkUnresolved?: (id: string) => Promise<void>;
}

const RequestCard: React.FC<RequestCardProps> = ({ 
  request, 
  onResolve,
  onMarkUnresolved
}) => {
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleResolve = async () => {
    if (!request.id || !response.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onResolve?.(request.id, response);
      setResponse('');
    } catch (error) {
      console.error('Error resolving request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleMarkUnresolved = async () => {
    if (!request.id) return;
    
    setIsSubmitting(true);
    try {
      await onMarkUnresolved?.(request.id);
    } catch (error) {
      console.error('Error marking request as unresolved:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const statusBadge = {
    pending: <Badge variant="warning">Pending</Badge>,
    resolved: <Badge variant="success">Resolved</Badge>,
    unresolved: <Badge variant="danger">Unresolved</Badge>
  };
  
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Question from Customer</CardTitle>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <Phone className="w-3 h-3" />
            <span>{request.customerPhone}</span>
            <Clock className="w-3 h-3 ml-2" />
            <span>
              {formatDistanceToNow(request.createdAt.toDate(), { addSuffix: true })}
            </span>
          </div>
        </div>
        {statusBadge[request.status]}
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 mb-4">{request.question}</p>
        
        {request.status === 'resolved' && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Response:</h4>
            <p className="text-sm bg-blue-50 p-3 rounded-md">{request.supervisorResponse}</p>
          </div>
        )}
        
        {request.status === 'pending' && onResolve && (
          <div className="mt-4">
            <label htmlFor={`response-${request.id}`} className="block text-sm font-medium text-gray-700 mb-1">
              Your Response:
            </label>
            <textarea
              id={`response-${request.id}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response here..."
            />
          </div>
        )}
      </CardContent>
      
      {request.status === 'pending' && onResolve && (
        <CardFooter className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={handleMarkUnresolved}
            disabled={isSubmitting}
          >
            Mark as Unresolved
          </Button>
          <Button 
            onClick={handleResolve} 
            disabled={!response.trim() || isSubmitting}
            isLoading={isSubmitting}
          >
            Send Response
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RequestCard;
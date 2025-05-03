import React from 'react';
import { KnowledgeItem as KnowledgeItemType } from '../../context/FirebaseContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { formatDistanceToNow } from 'date-fns';

interface KnowledgeItemProps {
  item: KnowledgeItemType;
}

const KnowledgeItem: React.FC<KnowledgeItemProps> = ({ item }) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-blue-600">Q: {item.question}</CardTitle>
        <div className="text-xs text-gray-500 mt-1">
          Added {formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true })}
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Answer:</h4>
          <p className="text-gray-700">{item.answer}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeItem;
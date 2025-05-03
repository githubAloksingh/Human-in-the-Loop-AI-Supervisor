import React, { useState, useEffect } from 'react';
import { useFirebase, KnowledgeItem as KnowledgeItemType } from '../context/FirebaseContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import KnowledgeItem from '../components/knowledge/KnowledgeItem';
import Button from '../components/ui/Button';
import { Search, RefreshCw } from 'lucide-react';

const KnowledgeBase: React.FC = () => {
  const firebase = useFirebase();
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const loadKnowledgeBase = async () => {
    setIsLoading(true);
    try {
      const items = await firebase.getKnowledgeBase();
      setKnowledgeItems(items);
    } catch (error) {
      console.error('Error loading knowledge base:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await loadKnowledgeBase();
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await firebase.searchKnowledgeBase(searchQuery);
      setKnowledgeItems(results);
    } catch (error) {
      console.error('Error searching knowledge base:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  useEffect(() => {
    loadKnowledgeBase();
  }, []);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Search Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search for questions or answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <Button 
              onClick={handleSearch}
              isLoading={isSearching}
            >
              Search
            </Button>
            <Button 
              variant="outline"
              onClick={loadKnowledgeBase}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {isLoading ? (
        <div className="flex justify-center p-8">Loading...</div>
      ) : knowledgeItems.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No knowledge items found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {knowledgeItems.map((item) => (
            <KnowledgeItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
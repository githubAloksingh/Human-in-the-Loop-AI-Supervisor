import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';

// Firebase configuration - in a real app, these would be in environment variables
const firebaseConfig = {
  apiKey: "AIzaSyBh9iDKoIvI3-k5W5kxliEe8F6DNcIlo8Y",
  authDomain: "prep-master-e1138.firebaseapp.com",
  projectId: "prep-master-e1138",
  storageBucket: "prep-master-e1138.firebasestorage.app",
  messagingSenderId: "879453703282",
  appId: "1:879453703282:web:386b6d6c0ccf7b90ea86eb",
  measurementId: "G-0C2WTNVCCT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Type definitions
export type RequestStatus = 'pending' | 'resolved' | 'unresolved';

export interface HelpRequest {
  id?: string;
  customerId: string;
  customerPhone: string;
  question: string;
  status: RequestStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  supervisorResponse?: string;
  respondedAt?: Timestamp;
}

export interface KnowledgeItem {
  id?: string;
  question: string;
  answer: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  requestId?: string;
}

// Firebase context
interface FirebaseContextType {
  // Help Requests
  createHelpRequest: (request: Omit<HelpRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<string>;
  getPendingRequests: () => Promise<HelpRequest[]>;
  getResolvedRequests: () => Promise<HelpRequest[]>;
  resolveRequest: (id: string, response: string) => Promise<void>;
  markRequestAsUnresolved: (id: string) => Promise<void>;
  subscribeToRequests: (callback: (requests: HelpRequest[]) => void) => () => void;
  
  // Knowledge Base
  addKnowledgeItem: (item: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  getKnowledgeBase: () => Promise<KnowledgeItem[]>;
  searchKnowledgeBase: (query: string) => Promise<KnowledgeItem[]>;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Create a help request
  const createHelpRequest = async (request: Omit<HelpRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const now = Timestamp.now();
    const helpRequestData: Omit<HelpRequest, 'id'> = {
      ...request,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, 'helpRequests'), helpRequestData);
    return docRef.id;
  };

  // Get all pending requests
  const getPendingRequests = async () => {
    const q = query(
      collection(db, 'helpRequests'), 
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as HelpRequest[];
  };

  // Get all resolved requests
  const getResolvedRequests = async () => {
    const q = query(
      collection(db, 'helpRequests'), 
      where('status', 'in', ['resolved', 'unresolved']),
      orderBy('updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as HelpRequest[];
  };

  // Resolve a request
  const resolveRequest = async (id: string, response: string) => {
    const requestRef = doc(db, 'helpRequests', id);
    const requestSnap = await getDoc(requestRef);
    
    if (requestSnap.exists()) {
      const requestData = requestSnap.data() as Omit<HelpRequest, 'id'>;
      
      // Update the request
      await updateDoc(requestRef, {
        status: 'resolved',
        supervisorResponse: response,
        respondedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Add to knowledge base
      await addKnowledgeItem({
        question: requestData.question,
        answer: response,
        requestId: id
      });

      // In a real scenario: Send text message to customer with response
      console.log(`Texting customer ${requestData.customerPhone}: "${response}"`);
    }
  };

  // Mark a request as unresolved
  const markRequestAsUnresolved = async (id: string) => {
    const requestRef = doc(db, 'helpRequests', id);
    await updateDoc(requestRef, {
      status: 'unresolved',
      updatedAt: Timestamp.now()
    });
  };

  // Subscribe to requests (real-time updates)
  const subscribeToRequests = (callback: (requests: HelpRequest[]) => void) => {
    const q = query(
      collection(db, 'helpRequests'),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HelpRequest[];
      
      callback(requests);
    });
  };

  // Add item to knowledge base
  const addKnowledgeItem = async (item: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Timestamp.now();
    const knowledgeItemData: Omit<KnowledgeItem, 'id'> = {
      ...item,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, 'knowledgeBase'), knowledgeItemData);
    return docRef.id;
  };

  // Get all knowledge base items
  const getKnowledgeBase = async () => {
    const q = query(
      collection(db, 'knowledgeBase'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as KnowledgeItem[];
  };

  // Search knowledge base
  const searchKnowledgeBase = async (searchQuery: string) => {
    // In a real app, we would use more sophisticated search
    // For demo purposes, we'll just get all and filter client-side
    const items = await getKnowledgeBase();
    return items.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const value = {
    createHelpRequest,
    getPendingRequests,
    getResolvedRequests,
    resolveRequest,
    markRequestAsUnresolved,
    subscribeToRequests,
    addKnowledgeItem,
    getKnowledgeBase,
    searchKnowledgeBase
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
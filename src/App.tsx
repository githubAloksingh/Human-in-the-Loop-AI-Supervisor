import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FirebaseProvider } from './context/FirebaseContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import PendingRequests from './pages/PendingRequests';
import ResolvedRequests from './pages/ResolvedRequests';
import KnowledgeBase from './pages/KnowledgeBase';
import SimulatedCall from './pages/SimulatedCall';

function App() {
  return (
    <FirebaseProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="pending-requests" element={<PendingRequests />} />
              <Route path="resolved-requests" element={<ResolvedRequests />} />
              <Route path="knowledge-base" element={<KnowledgeBase />} />
              <Route path="simulate-call" element={<SimulatedCall />} />
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </FirebaseProvider>
  );
}

export default App;

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { SignatureRequestProvider } from './hooks/useSignatureRequests';
import Dashboard from './components/Dashboard';
import NewRequest from './components/NewRequest';
import SigningPage from './components/SigningPage';
import Header from './components/Header';
import RequestDetails from './components/RequestDetails';

function App() {
  return (
    <SignatureRequestProvider>
      <HashRouter>
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
          <Header />
          <main className="container mx-auto p-4 md:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/new" element={<NewRequest />} />
              <Route path="/request/:requestId" element={<RequestDetails />} />
              <Route path="/sign/:requestId/:signerId" element={<SigningPage />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </SignatureRequestProvider>
  );
}

export default App;

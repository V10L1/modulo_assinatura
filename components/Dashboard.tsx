
import React from 'react';
import { useSignatureRequests } from '../hooks/useSignatureRequests';
import SignatureRequestCard from './SignatureRequestCard';
import { PlusIcon } from './IconComponents';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { requests } = useSignatureRequests();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Signature Requests</h1>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No signature requests yet.</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Get started by creating a new request.</p>
            <Link
                to="/new"
                className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
                <PlusIcon className="w-5 h-5" />
                Create New Request
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map(request => (
            <SignatureRequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

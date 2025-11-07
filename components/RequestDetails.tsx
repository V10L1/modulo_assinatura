
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSignatureRequests } from '../hooks/useSignatureRequests';
import { RequestStatus, SignerStatus } from '../types';
import { CheckCircleIcon, ClockIcon, XCircleIcon, DocumentIcon } from './IconComponents';

const SignerStatusIcon = ({ status }: { status: SignerStatus }) => {
    if (status === SignerStatus.Signed) {
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    }
    if (status === SignerStatus.Declined) {
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
    }
    return <ClockIcon className="w-5 h-5 text-yellow-500" />;
};

const RequestDetails = () => {
    const { requestId } = useParams();
    const { getRequestById } = useSignatureRequests();
    
    const request = useMemo(() => {
        if (!requestId) return null;
        return getRequestById(requestId);
    }, [requestId, getRequestById]);

    if (!request) {
        return <div className="text-center p-10">
            <h2 className="text-xl font-semibold">Request not found</h2>
            <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Back to Dashboard</Link>
        </div>;
    }

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
                 <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <DocumentIcon className="w-8 h-8 text-blue-500" />
                        {request.documentName}
                    </h1>
                </div>
                <div className="w-full h-[80vh] bg-slate-200 dark:bg-slate-900">
                    <iframe src={request.documentDataUrl} className="w-full h-full" title={request.documentName} />
                </div>
            </div>

            <div className="space-y-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-3 dark:border-slate-700">Signers</h2>
                    <ul className="space-y-4">
                        {request.signers.map(signer => (
                            <li key={signer.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <SignerStatusIcon status={signer.status} />
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">{signer.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{signer.email}</p>
                                        {signer.status === SignerStatus.Signed && signer.signedAt && (
                                            <p className="text-xs text-green-600 dark:text-green-400">Signed on {signer.signedAt.toLocaleString()}</p>
                                        )}
                                    </div>
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    signer.status === SignerStatus.Signed ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                                    signer.status === SignerStatus.Declined ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                                }`}>{signer.status}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-3 dark:border-slate-700">Activity Log</h2>
                    <ul className="space-y-4">
                        {request.activityLog.map(log => (
                           <li key={log.id} className="flex gap-4">
                               <div className="flex-shrink-0">
                                   <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                       <ClockIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                   </div>
                               </div>
                               <div>
                                   <p className="text-sm text-slate-800 dark:text-slate-200">
                                       <span className="font-semibold">{log.actor}</span> {log.description}
                                    </p>
                                   <p className="text-xs text-slate-500 dark:text-slate-400">{log.timestamp.toLocaleString()}</p>
                               </div>
                           </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RequestDetails;

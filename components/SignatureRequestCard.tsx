
import React from 'react';
import { Link } from 'react-router-dom';
import { SignatureRequest, RequestStatus, SignerStatus } from '../types';
import { ClockIcon, CheckCircleIcon, XCircleIcon, DocumentIcon } from './IconComponents';

interface SignatureRequestCardProps {
  request: SignatureRequest;
}

const statusInfo = {
  [RequestStatus.Pending]: {
    icon: <ClockIcon className="w-5 h-5 text-yellow-500" />,
    textColor: 'text-yellow-500',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/50',
    borderColor: 'border-yellow-500/50'
  },
  [RequestStatus.Completed]: {
    icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
    textColor: 'text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900/50',
    borderColor: 'border-green-500/50'
  },
  [RequestStatus.Declined]: {
    icon: <XCircleIcon className="w-5 h-5 text-red-500" />,
    textColor: 'text-red-500',
    bgColor: 'bg-red-100 dark:bg-red-900/50',
    borderColor: 'border-red-500/50'
  }
};

const SignatureRequestCard = ({ request }: SignatureRequestCardProps) => {
  const currentStatusInfo = statusInfo[request.status];
  const signedCount = request.signers.filter(s => s.status === SignerStatus.Signed).length;
  const totalSigners = request.signers.length;

  return (
    <Link to={`/request/${request.id}`} className="block">
        <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4 ${currentStatusInfo.borderColor}`}>
        <div className="p-5">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                     <div className="flex-shrink-0">
                        <DocumentIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-slate-800 dark:text-white truncate" title={request.documentName}>
                            {request.documentName}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Created on {request.createdAt.toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${currentStatusInfo.bgColor} ${currentStatusInfo.textColor}`}>
                    {currentStatusInfo.icon}
                    <span>{request.status}</span>
                </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-sm">
                    <p className="text-slate-600 dark:text-slate-300">Signers:</p>
                    <p className="font-medium text-slate-800 dark:text-slate-100">{signedCount} of {totalSigners} signed</p>
                </div>
                 <div className="flex space-x-1 mt-2">
                    {request.signers.map(signer => (
                        <div 
                            key={signer.id} 
                            title={`${signer.name} (${signer.status})`}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                                signer.status === SignerStatus.Signed ? 'bg-green-500' : 
                                signer.status === SignerStatus.Declined ? 'bg-red-500' :
                                'bg-slate-400'
                            }`}
                        >
                           {signer.name.charAt(0).toUpperCase()}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </div>
    </Link>
  );
};

export default SignatureRequestCard;

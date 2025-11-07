
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSignatureRequests } from '../hooks/useSignatureRequests';
import { SignatureRequest, Signer, SignerStatus } from '../types';
// Fix: Added XCircleIcon to the import list.
import { CheckIcon, XMarkIcon, CheckCircleIcon, XCircleIcon } from './IconComponents';

const SigningPage = () => {
  const { requestId, signerId } = useParams();
  const { getRequestById, updateSignerStatus } = useSignatureRequests();

  const [request, setRequest] = useState<SignatureRequest | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [error, setError] = useState<string>('');
  const [isSigned, setIsSigned] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);

  useEffect(() => {
    if (requestId && signerId) {
      const foundRequest = getRequestById(requestId);
      if (foundRequest) {
        const foundSigner = foundRequest.signers.find(s => s.id === signerId);
        if (foundSigner) {
          setRequest(foundRequest);
          setSigner(foundSigner);
          if (foundSigner.status === SignerStatus.Signed) setIsSigned(true);
          if (foundSigner.status === SignerStatus.Declined) setIsDeclined(true);
        } else {
          setError('Signer not found.');
        }
      } else {
        setError('Signature request not found.');
      }
    }
  }, [requestId, signerId, getRequestById]);

  const handleSign = () => {
    if (requestId && signerId) {
      updateSignerStatus(requestId, signerId, SignerStatus.Signed);
      setIsSigned(true);
    }
  };
  
  const handleDecline = () => {
    if (requestId && signerId) {
      updateSignerStatus(requestId, signerId, SignerStatus.Declined);
      setIsDeclined(true);
    }
  };


  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!request || !signer) {
    return <div className="text-center py-20">Loading...</div>;
  }
  
  if(isSigned) {
    return (
        <div className="max-w-4xl mx-auto text-center py-20 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
            <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Document Signed!</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Thank you, {signer.name}. Your signature has been recorded.</p>
        </div>
    )
  }

  if(isDeclined) {
    return (
        <div className="max-w-4xl mx-auto text-center py-20 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
            <XCircleIcon className="w-24 h-24 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Request Declined</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">You have declined to sign this document. The sender has been notified.</p>
        </div>
    )
  }


  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{request.documentName}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            You are signing as <span className="font-semibold">{signer.name} ({signer.email})</span>.
          </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
        <div className="w-full h-[80vh]">
          <iframe src={request.documentDataUrl} className="w-full h-full" title={request.documentName} />
        </div>
      </div>
      
      <div className="sticky bottom-0 left-0 right-0 mt-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 border-t border-slate-200 dark:border-slate-700 shadow-lg rounded-t-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400">Please review the document before signing.</p>
              <div className="flex gap-4">
                  <button onClick={handleDecline} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all">
                      <XMarkIcon className="w-5 h-5"/>
                      Decline
                  </button>
                  <button onClick={handleSign} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all">
                      <CheckIcon className="w-5 h-5"/>
                      I Agree & Sign
                  </button>
              </div>
          </div>
      </div>
    </>
  );
};

export default SigningPage;


import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { SignatureRequest, RequestStatus, Signer, SignerStatus, ActivityLogEntry } from '../types';

interface SignatureRequestContextType {
  requests: SignatureRequest[];
  getRequestById: (id: string) => SignatureRequest | undefined;
  addRequest: (request: Omit<SignatureRequest, 'id' | 'createdAt' | 'status' | 'activityLog'>) => SignatureRequest;
  updateSignerStatus: (requestId: string, signerId: string, status: SignerStatus) => void;
}

const SignatureRequestContext = createContext<SignatureRequestContextType | undefined>(undefined);

const initialRequests: SignatureRequest[] = [
    {
        id: 'demo-1',
        documentName: 'Project Alpha Agreement.pdf',
        documentDataUrl: 'about:blank',
        status: RequestStatus.Pending,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        message: 'Hi team, please review and sign the Project Alpha agreement by EOD Friday.',
        signers: [
            { id: 'signer-1a', name: 'Alice Johnson', email: 'alice@example.com', status: SignerStatus.Signed, signedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
            { id: 'signer-1b', name: 'Bob Williams', email: 'bob@example.com', status: SignerStatus.Pending },
        ],
        activityLog: [
            { id: 'log-1-1', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), description: 'Request created and sent.', actor: 'System' },
            { id: 'log-1-2', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), description: 'Signed the document.', actor: 'Alice Johnson' },
        ],
    },
    {
        id: 'demo-2',
        documentName: 'Q3 Financial Report.pdf',
        documentDataUrl: 'about:blank',
        status: RequestStatus.Completed,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        message: 'Please sign off on the Q3 financial report.',
        signers: [
            { id: 'signer-2a', name: 'Charlie Brown', email: 'charlie@example.com', status: SignerStatus.Signed, signedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
        ],
        activityLog: [
            { id: 'log-2-1', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), description: 'Request created and sent.', actor: 'System' },
            { id: 'log-2-2', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), description: 'Signed the document.', actor: 'Charlie Brown' },
        ],
    }
];


export const SignatureRequestProvider = ({ children }: { children: ReactNode }) => {
  const [requests, setRequests] = useState<SignatureRequest[]>(initialRequests);

  const getRequestById = useCallback((id: string) => {
    return requests.find(r => r.id === id);
  }, [requests]);

  const addRequest = (requestData: Omit<SignatureRequest, 'id' | 'createdAt' | 'status' | 'activityLog'>) => {
    const newRequest: SignatureRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      createdAt: new Date(),
      status: RequestStatus.Pending,
      activityLog: [{
        id: `log-${Date.now()}`,
        timestamp: new Date(),
        description: 'Request created and sent.',
        actor: 'System',
      }],
    };
    setRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  const updateSignerStatus = (requestId: string, signerId: string, status: SignerStatus) => {
    setRequests(prev => {
      return prev.map(req => {
        if (req.id === requestId) {
          let signerName = 'Unknown';
          const updatedSigners = req.signers.map(signer => {
            if (signer.id === signerId) {
              signerName = signer.name;
              return { ...signer, status, signedAt: status === SignerStatus.Signed ? new Date() : undefined };
            }
            return signer;
          });

          const logDescription = status === SignerStatus.Signed 
            ? 'Signed the document.'
            : 'Declined to sign the document.';
          
          const newLogEntry: ActivityLogEntry = {
            id: `log-${Date.now()}`,
            timestamp: new Date(),
            description: logDescription,
            actor: signerName,
          };
          
          const allSigned = updatedSigners.every(s => s.status === SignerStatus.Signed);
          const anyDeclined = updatedSigners.some(s => s.status === SignerStatus.Declined);
          
          let newReqStatus = req.status;
          if (anyDeclined) {
            newReqStatus = RequestStatus.Declined;
          } else if (allSigned) {
            newReqStatus = RequestStatus.Completed;
          }

          return { ...req, signers: updatedSigners, status: newReqStatus, activityLog: [...req.activityLog, newLogEntry] };
        }
        return req;
      });
    });
  };

  // Fix: Replaced JSX with React.createElement to resolve parsing errors in a .ts file.
  // This resolves multiple errors related to incorrect parsing of JSX syntax.
  return React.createElement(
    SignatureRequestContext.Provider,
    { value: { requests, getRequestById, addRequest, updateSignerStatus } },
    children
  );
};

export const useSignatureRequests = () => {
  const context = useContext(SignatureRequestContext);
  if (context === undefined) {
    throw new Error('useSignatureRequests must be used within a SignatureRequestProvider');
  }
  return context;
};

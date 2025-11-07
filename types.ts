
export enum RequestStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Declined = 'Declined',
}

export enum SignerStatus {
    Pending = 'Pending',
    Signed = 'Signed',
    Declined = 'Declined',
}

export interface Signer {
  id: string;
  name: string;
  email: string;
  signedAt?: Date;
  status: SignerStatus;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  description: string;
  actor: string; // e.g., 'System', Signer's Name
}

export interface SignatureRequest {
  id: string;
  documentName: string;
  documentDataUrl: string;
  status: RequestStatus;
  createdAt: Date;
  signers: Signer[];
  activityLog: ActivityLogEntry[];
  message: string;
}

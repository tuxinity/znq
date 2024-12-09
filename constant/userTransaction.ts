export interface IUserTransaction {
    value: string;
    id: string;
    txnId: string;
    txHash?: string; 
    email: string;
    user?: {
      email: string;
    }; 
    transactionDate: string; 
    amount: number; 
    status: string; 
    reference: string; 
    createdAt?: Date;
    action?: () => void;
  }
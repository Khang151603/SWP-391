// Finance API Types
export interface Transaction {
  id: number;
  clubId: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category?: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  clubId: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category?: string;
}

export interface UpdateTransactionRequest {
  type?: 'income' | 'expense';
  amount?: number;
  description?: string;
  category?: string;
}

export interface FinanceReport {
  clubId: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactions: Transaction[];
  period: {
    startDate: string;
    endDate: string;
  };
}


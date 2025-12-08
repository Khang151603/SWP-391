import { httpClient } from '../config/client';
import { FINANCE_ENDPOINTS } from '../config/constants';
import type {
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  FinanceReport,
} from '../types/finance.types';

/**
 * Finance Service
 */
export const financeService = {
  /**
   * Get club finances
   */
  async getClubFinances(clubId: number | string): Promise<Transaction[]> {
    return httpClient.get<Transaction[]>(
      FINANCE_ENDPOINTS.GET_CLUB_FINANCES(clubId)
    );
  },

  /**
   * Get transaction by ID
   */
  async getTransactionById(id: number | string): Promise<Transaction> {
    return httpClient.get<Transaction>(
      FINANCE_ENDPOINTS.GET_TRANSACTION_BY_ID(id)
    );
  },

  /**
   * Create transaction
   */
  async createTransaction(
    data: CreateTransactionRequest
  ): Promise<Transaction> {
    return httpClient.post<Transaction>(
      FINANCE_ENDPOINTS.CREATE_TRANSACTION,
      data
    );
  },

  /**
   * Update transaction
   */
  async updateTransaction(
    id: number | string,
    data: UpdateTransactionRequest
  ): Promise<Transaction> {
    return httpClient.put<Transaction>(
      FINANCE_ENDPOINTS.UPDATE_TRANSACTION(id),
      data
    );
  },

  /**
   * Delete transaction
   */
  async deleteTransaction(id: number | string): Promise<void> {
    return httpClient.delete<void>(FINANCE_ENDPOINTS.DELETE_TRANSACTION(id));
  },

  /**
   * Get finance report
   */
  async getReport(clubId: number | string): Promise<FinanceReport> {
    return httpClient.get<FinanceReport>(FINANCE_ENDPOINTS.GET_REPORT(clubId));
  },
};


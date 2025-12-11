import { httpClient } from '../config/client';
import { FINANCE_ENDPOINTS } from '../config/constants';
import type {
  Transaction,
  CreateTransactionRequest,
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
   * Get finance report
   */
  async getReport(clubId: number | string): Promise<FinanceReport> {
    return httpClient.get<FinanceReport>(FINANCE_ENDPOINTS.GET_REPORT(clubId));
  },
};


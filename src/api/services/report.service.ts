import { httpClient } from '../config/client';
import { REPORT_ENDPOINTS } from '../config/constants';
import type {
  Report,
  CreateReportRequest,
  UpdateReportRequest,
} from '../types/report.types';

/**
 * Report Service
 */
export const reportService = {
  /**
   * Get all reports
   */
  async getAll(): Promise<Report[]> {
    return httpClient.get<Report[]>(REPORT_ENDPOINTS.GET_ALL);
  },

  /**
   * Get report by ID
   */
  async getById(id: number | string): Promise<Report> {
    return httpClient.get<Report>(REPORT_ENDPOINTS.GET_BY_ID(id));
  },

  /**
   * Create a new report
   */
  async create(data: CreateReportRequest): Promise<Report> {
    return httpClient.post<Report>(REPORT_ENDPOINTS.CREATE, data);
  },

  /**
   * Update report
   */
  async update(
    id: number | string,
    data: UpdateReportRequest
  ): Promise<Report> {
    return httpClient.put<Report>(REPORT_ENDPOINTS.UPDATE(id), data);
  },

  /**
   * Delete report
   */
  async delete(id: number | string): Promise<void> {
    return httpClient.delete<void>(REPORT_ENDPOINTS.DELETE(id));
  },

  /**
   * Get reports by club
   */
  async getByClub(clubId: number | string): Promise<Report[]> {
    return httpClient.get<Report[]>(REPORT_ENDPOINTS.GET_BY_CLUB(clubId));
  },
};


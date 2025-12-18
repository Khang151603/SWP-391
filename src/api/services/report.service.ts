import { httpClient } from '../config/client';
import { REPORT_ENDPOINTS } from '../config/constants';
import type { ClubReport } from '../types/report.types';

/**
 * Report Service for Club Leader
 */
export const reportService = {
  /**
   * Get report for a single club
   */
  async getClubReport(clubId: number | string): Promise<ClubReport> {
    return httpClient.get<ClubReport>(REPORT_ENDPOINTS.CLUB_REPORT(clubId));
  },

  /**
   * Get report for all clubs managed by current leader
   */
  async getMyClubsReport(): Promise<ClubReport[]> {
    return httpClient.get<ClubReport[]>(REPORT_ENDPOINTS.MY_CLUBS_REPORT);
  },
};



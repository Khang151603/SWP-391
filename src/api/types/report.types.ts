// Report types mapped from BE DTO.DTO.Report

export interface LeaderInfo {
  leaderName: string;
  startDate?: string | null; // DateOnly? from BE, serialized as string
}

export interface ClubInfo {
  clubId: number;
  clubName: string;
  description?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  activityFrequency?: string | null;
}

export interface ClubStatistics {
  totalMembers: number;
  activeMembers: number;
  newMembers: number;
  totalActivities: number;
  totalIncome: number;
}

export interface ActivityReport {
  activityId: number;
  title: string;
  startTime?: string | null;
  location: string;
  participants: number;
  status: string;
}

export interface ClubReport {
  club: ClubInfo;
  leader?: LeaderInfo | null;
  statistics: ClubStatistics;
  activities: ActivityReport[];
}

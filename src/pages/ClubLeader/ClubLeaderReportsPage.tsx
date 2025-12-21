import { useEffect, useMemo, useState } from 'react';
import LeaderLayout from '../../components/layout/LeaderLayout';
import { reportService } from '../../api/services/report.service';
import type { ClubReport } from '../../api/types/report.types';
import { cn } from '../../components/utils/cn';

type ViewMode = 'summary' | 'activities';
type TimeFilter = 'all' | '30d' | '90d' | '365d';
type ActivityStatusFilter = 'all' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

function ClubLeaderReportsPage() {
  const [reports, setReports] = useState<ClubReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('summary');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [activityStatusFilter, setActivityStatusFilter] =
    useState<ActivityStatusFilter>('all');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await reportService.getMyClubsReport();
        setReports(data);
        if (data.length > 0) {
          setSelectedClubId(data[0].club.clubId);
        }
      } catch {
        setError('Không thể tải báo cáo. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const selectedReport = useMemo(
    () => reports.find(r => r.club.clubId === selectedClubId) || null,
    [reports, selectedClubId]
  );

  const aggregateStats = useMemo(() => {
    if (reports.length === 0) {
      return {
        totalClubs: 0,
        totalMembers: 0,
        totalActiveMembers: 0,
        totalActivities: 0,
        totalIncome: 0,
      };
    }

    return reports.reduce(
      (acc, r) => {
        acc.totalClubs += 1;
        acc.totalMembers += r.statistics.totalMembers;
        acc.totalActiveMembers += r.statistics.activeMembers;
        acc.totalActivities += r.statistics.totalActivities;
        acc.totalIncome += Number(r.statistics.totalIncome || 0);
        return acc;
      },
      {
        totalClubs: 0,
        totalMembers: 0,
        totalActiveMembers: 0,
        totalActivities: 0,
        totalIncome: 0,
      }
    );
  }, [reports]);

  const filteredActivities = useMemo(() => {
    if (!selectedReport || !selectedReport.activities.length) return [];

    const now = new Date();
    let minDate: Date | null = null;

    if (timeFilter === '30d') {
      minDate = new Date(now);
      minDate.setDate(now.getDate() - 30);
    } else if (timeFilter === '90d') {
      minDate = new Date(now);
      minDate.setDate(now.getDate() - 90);
    } else if (timeFilter === '365d') {
      minDate = new Date(now);
      minDate.setDate(now.getDate() - 365);
    }

    return selectedReport.activities.filter(a => {
      // Time filter
      if (minDate && a.startTime) {
        const start = new Date(a.startTime);
        if (isNaN(start.getTime()) || start < minDate) return false;
      }

      // Status filter
      if (activityStatusFilter === 'all') return true;
      const status = (a.status || '').toLowerCase();
      if (activityStatusFilter === 'upcoming') {
        return status === 'active' || status === 'opened' || status === 'not_yet_open';
      }
      if (activityStatusFilter === 'ongoing') {
        return status === 'ongoing';
      }
      if (activityStatusFilter === 'completed') {
        return status === 'completed';
      }
      if (activityStatusFilter === 'cancelled') {
        return status === 'cancelled';
      }
      return true;
    });
  }, [selectedReport, timeFilter, activityStatusFilter]);

  const activitySummaryForSelectedClub = useMemo(() => {
    if (!selectedReport) {
      return {
        total: 0,
        avgParticipants: 0,
        participationRate: 0,
      };
    }

    const activities = filteredActivities;
    if (!activities.length) {
      return {
        total: 0,
        avgParticipants: 0,
        participationRate: 0,
      };
    }

    const totalParticipants = activities.reduce(
      (sum, a) => sum + (a.participants || 0),
      0
    );
    const avgParticipants = totalParticipants / activities.length;
    const totalMembers = selectedReport.statistics.totalMembers || 0;
    const participationRate =
      totalMembers > 0 ? (avgParticipants / totalMembers) * 100 : 0;

    return {
      total: activities.length,
      avgParticipants,
      participationRate,
    };
  }, [filteredActivities, selectedReport]);

  const handleExportCsv = () => {
    if (!reports.length) return;

    const escapeCsvValue = (value: any): string => {
      if (value === null || value === undefined) return '""';
      const str = String(value);
      // Escape quotes and wrap in quotes
      return `"${str.replace(/"/g, '""')}"`;
    };

    const header = [
      'ClubId',
      'Tên CLB',
      'Thành viên tổng',
      'Thành viên active',
      'Hoạt động tổng',
      'Tổng thu (đ)',
    ];

    const rows = reports.map(r => [
      escapeCsvValue(r.club.clubId),
      escapeCsvValue(r.club.clubName),
      escapeCsvValue(r.statistics.totalMembers),
      escapeCsvValue(r.statistics.activeMembers),
      escapeCsvValue(r.statistics.totalActivities),
      escapeCsvValue(r.statistics.totalIncome),
    ]);

    // Add BOM for UTF-8 encoding (Excel compatibility)
    const csvContent =
      '\uFEFF' +
      [header.map(escapeCsvValue).join(','), ...rows.map(r => r.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `club_reports_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportClubActivitiesCsv = () => {
    if (!selectedReport) return;

    const escapeCsvValue = (value: any): string => {
      if (value === null || value === undefined) return '""';
      const str = String(value);
      // Escape quotes and wrap in quotes
      return `"${str.replace(/"/g, '""')}"`;
    };

    const getStatusLabel = (status: string): string => {
      const statusLower = status.toLowerCase();
      const statusMap: Record<string, string> = {
        active: 'Đang hoạt động',
        inactive: 'Không hoạt động',
        unactive: 'Không hoạt động',
        pending: 'Chờ duyệt',
        cancelled: 'Đã hủy',
        completed: 'Đã hoàn thành',
        finished: 'Đã kết thúc',
        ongoing: 'Đang diễn ra',
        closed: 'Đã đóng',
        opened: 'Đã mở',
        not_yet_open: 'Chưa mở',
        notyetopen: 'Chưa mở',
        locked: 'Đã khóa',
        approved: 'Đã duyệt',
        failed: 'Thất bại',
      };
      return statusMap[statusLower] || status;
    };

    const header = [
      'ActivityId',
      'Tiêu đề',
      'Thời gian bắt đầu',
      'Địa điểm',
      'Số người tham gia',
      'Trạng thái',
    ];

    const rows = filteredActivities.map(a => [
      escapeCsvValue(a.activityId),
      escapeCsvValue(a.title),
      escapeCsvValue(
        a.startTime
          ? new Date(a.startTime).toLocaleString('vi-VN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })
          : ''
      ),
      escapeCsvValue(a.location || ''),
      escapeCsvValue(a.participants || 0),
      escapeCsvValue(getStatusLabel(a.status || '')),
    ]);

    // Add BOM for UTF-8 encoding (Excel compatibility)
    const csvContent =
      '\uFEFF' +
      [header.map(escapeCsvValue).join(','), ...rows.map(r => r.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `club_${selectedReport.club.clubId}_activities_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  return (
    <LeaderLayout
      title="Báo cáo tổng quan CLB"
      subtitle="Thống kê nhanh về thành viên, hoạt động và hiệu quả các câu lạc bộ bạn quản lý"
    >
      <div className="space-y-8">
        {/* Summary cards */}
        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Tổng CLB
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {aggregateStats.totalClubs}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Thành viên
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {aggregateStats.totalMembers}
            </p>
            <p className="mt-1 text-xs text-emerald-700">
              {aggregateStats.totalActiveMembers} đang hoạt động
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Hoạt động
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {aggregateStats.totalActivities}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Tổng thu
            </p>
            <p className="mt-2 text-xl font-semibold text-blue-700">
              {formatCurrency(aggregateStats.totalIncome)}
            </p>
          </div>
        </section>

        {/* Toolbar */}
        <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-700">
              Chọn CLB
              <select
                className="mt-1 ml-2 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                value={selectedClubId ?? ''}
                onChange={e =>
                  setSelectedClubId(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              >
                {reports.map(r => (
                  <option key={r.club.clubId} value={r.club.clubId}>
                    {r.club.clubName}
                  </option>
                ))}
              </select>
            </label>
            <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('summary')}
                className={cn(
                  'rounded-full px-3 py-1.5',
                  viewMode === 'summary'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                Tổng quan
              </button>
              <button
                type="button"
                onClick={() => setViewMode('activities')}
                className={cn(
                  'rounded-full px-3 py-1.5',
                  viewMode === 'activities'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                Hoạt động
              </button>
            </div>
            {viewMode === 'activities' && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="font-medium">Khoảng thời gian:</span>
                <select
                  value={timeFilter}
                  onChange={e => setTimeFilter(e.target.value as TimeFilter)}
                  className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">Tất cả</option>
                  <option value="30d">30 ngày</option>
                  <option value="90d">90 ngày</option>
                  <option value="365d">12 tháng</option>
                </select>
                <span className="ml-2 font-medium">Trạng thái:</span>
                <select
                  value={activityStatusFilter}
                  onChange={e =>
                    setActivityStatusFilter(
                      e.target.value as ActivityStatusFilter
                    )
                  }
                  className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">Tất cả</option>
                  <option value="upcoming">Sắp diễn ra</option>
                  <option value="ongoing">Đang diễn ra</option>
                  <option value="completed">Đã kết thúc</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={!reports.length}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>Xuất tổng quan (CSV)</span>
            </button>
            <button
              type="button"
              onClick={handleExportClubActivitiesCsv}
              disabled={!selectedReport || !selectedReport.activities.length}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>Xuất hoạt động CLB (CSV)</span>
            </button>
          </div>
        </section>

        {/* Content */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Đang tải dữ liệu báo cáo...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        ) : !reports.length ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Bạn chưa quản lý câu lạc bộ nào, nên chưa có dữ liệu báo cáo.
          </div>
        ) : viewMode === 'summary' ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Báo cáo tổng quan theo CLB
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">CLB</th>
                    <th className="px-4 py-3">Thành viên</th>
                    <th className="px-4 py-3">Hoạt động</th>
                    <th className="px-4 py-3">Tổng thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.map(r => (
                    <tr key={r.club.clubId} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">
                            {r.club.clubName}
                          </span>
                          {r.leader?.leaderName && (
                            <span className="text-xs text-slate-500">
                              Leader: {r.leader.leaderName}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        <div className="flex flex-col text-sm">
                          <span>
                            Tổng:{' '}
                            <span className="font-semibold">
                              {r.statistics.totalMembers}
                            </span>
                          </span>
                          <span className="text-xs text-emerald-700">
                            Active: {r.statistics.activeMembers}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        <span className="font-semibold">
                          {r.statistics.totalActivities}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        <span className="font-semibold text-blue-700">
                          {formatCurrency(Number(r.statistics.totalIncome || 0))}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Danh sách hoạt động của CLB
            </h3>
            {selectedReport ? (
              <>
                <p className="mb-4 text-sm text-slate-600">
                  {selectedReport.club.clubName} ·{' '}
                  {filteredActivities.length} hoạt động (đang lọc)
                </p>
                <div className="mb-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-[11px] uppercase text-slate-500">
                      Số hoạt động
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {activitySummaryForSelectedClub.total}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-[11px] uppercase text-slate-500">
                      TB người tham gia
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {activitySummaryForSelectedClub.avgParticipants.toFixed(1)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-[11px] uppercase text-slate-500">
                      Tỉ lệ tham gia
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {activitySummaryForSelectedClub.participationRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
                {filteredActivities.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    CLB này chưa có hoạt động nào.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Tiêu đề</th>
                          <th className="px-4 py-3">Thời gian</th>
                          <th className="px-4 py-3">Địa điểm</th>
                          <th className="px-4 py-3 text-center">
                            Tham gia
                          </th>
                          <th className="px-4 py-3 text-center">
                            Trạng thái
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredActivities.map(a => (
                          <tr
                            key={a.activityId}
                            className="hover:bg-slate-50/60"
                          >
                            <td className="px-4 py-3 font-medium text-slate-900">
                              {a.title}
                            </td>
                            <td className="px-4 py-3 text-slate-700">
                              {a.startTime
                                ? new Date(
                                    a.startTime
                                  ).toLocaleString('vi-VN')
                                : '--'}
                            </td>
                            <td className="px-4 py-3 text-slate-700">
                              {a.location}
                            </td>
                            <td className="px-4 py-3 text-center text-slate-700">
                              {a.participants}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                {a.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-500">
                Hãy chọn một CLB ở phía trên để xem chi tiết hoạt động.
              </p>
            )}
          </section>
        )}
      </div>
    </LeaderLayout>
  );
}

export default ClubLeaderReportsPage;



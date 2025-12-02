import { useParams, Link } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';

function StudentExploreDetailPage() {
  const { clubId } = useParams();
  const formattedName =
    clubId?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') ?? 'CLB';

  return (
    <StudentLayout title={formattedName} subtitle="Thông tin chi tiết câu lạc bộ đang tuyển thành viên">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link to="/student/explore" className="transition hover:text-white">
            Khám phá CLB
          </Link>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-white">{formattedName}</span>
        </nav>

        {/* Simple hero */}
        <div className="rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 p-6 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-white">{formattedName}</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-200">
            Đây là trang xem chi tiết CLB khi bạn truy cập từ màn hình Khám phá. Bạn có thể tùy ý thay thế nội dung
            mock này bằng dữ liệu thật từ API sau này.
          </p>
        </div>
      </div>
    </StudentLayout>
  );
}

export default StudentExploreDetailPage;



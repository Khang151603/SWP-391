import { useParams, Link } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';

const mockClubDetail = {
  description:
    'CLB Lập trình Sáng tạo là nơi sinh viên đam mê công nghệ có thể học hỏi, thực hành và phát triển các dự án phần mềm thực tế. Chúng tôi tổ chức các buổi workshop, hackathon và kết nối với các chuyên gia trong ngành.',
  requirements: ['Tham gia tối thiểu 2 hoạt động/tháng', 'Điểm rèn luyện ≥ 75', 'Sẵn sàng training cuối tuần'],
  highlights: ['Mentor doanh nghiệp', 'Workshop chuyên sâu', 'Sinh hoạt song ngữ'],
};

function ClubDetailPage() {
  const { clubId } = useParams();
  const formattedName = clubId?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') ?? 'CLB';

  return (
    <StudentLayout title={formattedName} subtitle="Thông tin chi tiết câu lạc bộ">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link to="/student/clubs" className="hover:text-white transition">
            CLB của tôi
          </Link>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-white">{formattedName}</span>
        </nav>

        {/* Hero Section */}
        <div className="rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 p-8 backdrop-blur-sm">
          <div className="mb-2 flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <h1 className="text-3xl font-bold text-white">{formattedName}</h1>
              <p className="max-w-3xl text-slate-300">{mockClubDetail.description}</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Right Column - 1/3 */}
          <div className="space-y-6">
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

export default ClubDetailPage;




import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import { Dialog } from '../../components/ui/Dialog';

// Mock data - sẽ thay bằng API call sau
const allClubs = [
  {
    id: 'innovation',
    name: 'CLB Lập trình Sáng tạo',
    category: 'tech',
    description: 'Học và chia sẻ kinh nghiệm lập trình, xây dựng dự án thực tế',
    fullDescription: 'CLB Lập trình Sáng tạo là nơi quy tụ những bạn trẻ đam mê công nghệ, muốn phát triển kỹ năng lập trình và xây dựng các dự án thực tế. Chúng tôi tổ chức các workshop, hackathon, và dự án cộng đồng để các thành viên có cơ hội học hỏi, thực hành và kết nối với nhau.',
    members: 127,
    activities: 2,
    fee: 500000,
    rating: 4.8,
    reviews: 45,
    tags: ['React', 'AI', 'Hackathon', 'Web Development', 'Mobile App'],
    badge: 'Top Pick',
    nextEvent: 'Workshop React - 15/12',
    recruiting: true,
    contact: {
      email: 'innovation@fpt.edu.vn',
      facebook: 'fb.com/clb-lap-trinh',
      meetingTime: 'Thứ 3, 5 hàng tuần - 18:00-20:00',
    },
    requirements: [
      'Sinh viên FPT University',
      'Có kiến thức cơ bản về lập trình',
      'Cam kết tham gia đầy đủ hoạt động',
    ],
  },
  {
    id: 'english',
    name: 'CLB Tiếng Anh Giao tiếp',
    category: 'language',
    description: 'Rèn luyện kỹ năng giao tiếp tiếng Anh qua hoạt động thực tế',
    fullDescription: 'CLB Tiếng Anh Giao tiếp giúp bạn tự tin hơn trong giao tiếp tiếng Anh thông qua các hoạt động thực tế như thuyết trình, debate, và các buổi giao lưu với người nước ngoài.',
    members: 95,
    activities: 3,
    fee: 350000,
    rating: 4.6,
    reviews: 38,
    tags: ['Speaking', 'TOEIC', 'Networking', 'Presentation'],
    badge: 'Popular',
    nextEvent: 'English Club - 12/12',
    recruiting: true,
    contact: {
      email: 'english@fpt.edu.vn',
      facebook: 'fb.com/clb-tieng-anh',
      meetingTime: 'Thứ 2, 4, 6 hàng tuần - 19:00-21:00',
    },
    requirements: [
      'Sinh viên FPT University',
      'Yêu thích học tiếng Anh',
      'Cam kết tham gia đầy đủ hoạt động',
    ],
  },
  {
    id: 'design',
    name: 'CLB Thiết kế Đồ họa',
    category: 'creative',
    description: 'Sáng tạo các tác phẩm thiết kế chuyên nghiệp',
    fullDescription: 'CLB Thiết kế Đồ họa là nơi các bạn yêu thích sáng tạo có thể học hỏi và phát triển kỹ năng thiết kế. Chúng tôi tổ chức các workshop về Photoshop, Illustrator, UI/UX design và các cuộc thi thiết kế.',
    members: 68,
    activities: 1,
    fee: 0,
    rating: 4.7,
    reviews: 29,
    tags: ['UI/UX', 'Photoshop', 'Illustrator', 'Graphic Design'],
    badge: 'Free',
    nextEvent: 'Design Contest - 18/12',
    recruiting: true,
    contact: {
      email: 'design@fpt.edu.vn',
      facebook: 'fb.com/clb-thiet-ke',
      meetingTime: 'Thứ 7 hàng tuần - 14:00-17:00',
    },
    requirements: [
      'Sinh viên FPT University',
      'Yêu thích thiết kế và sáng tạo',
      'Có laptop cá nhân (khuyến khích)',
    ],
  },
  {
    id: 'volunteer',
    name: 'CLB Tình nguyện Xanh',
    category: 'creative',
    description: 'Hoạt động tình nguyện vì cộng đồng và môi trường',
    fullDescription: 'CLB Tình nguyện Xanh tập trung vào các hoạt động thiện nguyện, bảo vệ môi trường và hỗ trợ cộng đồng. Chúng tôi tổ chức các chương trình quyên góp, dọn dẹp môi trường, và các hoạt động từ thiện.',
    members: 156,
    activities: 2,
    fee: 0,
    rating: 4.9,
    reviews: 87,
    tags: ['Thiện nguyện', 'Môi trường', 'Cộng đồng', 'Từ thiện'],
    badge: 'Top Rated',
    nextEvent: 'Mùa đông ấm - 10/12',
    recruiting: true,
    contact: {
      email: 'volunteer@fpt.edu.vn',
      facebook: 'fb.com/clb-tinh-nguyen',
      meetingTime: 'Cuối tuần - Linh hoạt theo hoạt động',
    },
    requirements: [
      'Sinh viên FPT University',
      'Có tinh thần tình nguyện',
      'Cam kết tham gia các hoạt động',
    ],
  },
  {
    id: 'blockchain',
    name: 'CLB Blockchain & Web3',
    category: 'tech',
    description: 'Nghiên cứu và phát triển ứng dụng Blockchain',
    fullDescription: 'CLB Blockchain & Web3 là nơi các bạn đam mê công nghệ blockchain có thể học hỏi, nghiên cứu và phát triển các ứng dụng Web3. Chúng tôi tổ chức các seminar, workshop về smart contract, DeFi, và NFT.',
    members: 82,
    activities: 1,
    fee: 400000,
    rating: 4.5,
    reviews: 31,
    tags: ['Blockchain', 'Smart Contract', 'DeFi', 'Web3', 'NFT'],
    badge: 'Popular',
    nextEvent: 'Seminar Web3 - 20/12',
    recruiting: false,
    contact: {
      email: 'blockchain@fpt.edu.vn',
      facebook: 'fb.com/clb-blockchain',
      meetingTime: 'Thứ 4 hàng tuần - 18:00-20:00',
    },
    requirements: [
      'Sinh viên FPT University',
      'Có kiến thức lập trình cơ bản',
      'Quan tâm đến công nghệ blockchain',
    ],
  },
  {
    id: 'football',
    name: 'CLB Bóng đá FPT',
    category: 'sport',
    description: 'Rèn luyện sức khỏe và kỹ năng bóng đá',
    fullDescription: 'CLB Bóng đá FPT là nơi các bạn yêu thích bóng đá có thể rèn luyện sức khỏe, kỹ năng chơi bóng và tham gia các giải đấu. Chúng tôi tổ chức tập luyện định kỳ và các trận giao hữu.',
    members: 143,
    activities: 3,
    fee: 200000,
    rating: 4.6,
    reviews: 56,
    tags: ['Thể thao', 'Sức khỏe', 'Teamwork', 'Bóng đá'],
    nextEvent: 'Giao hữu - Thứ 7',
    recruiting: true,
    contact: {
      email: 'football@fpt.edu.vn',
      facebook: 'fb.com/clb-bong-da-fpt',
      meetingTime: 'Thứ 3, 5, 7 hàng tuần - 17:00-19:00',
    },
    requirements: [
      'Sinh viên FPT University',
      'Yêu thích bóng đá',
      'Có sức khỏe tốt',
    ],
  },
];

function StudentExploreDetailPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [selectedClub, setSelectedClub] = useState<typeof allClubs[0] | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const club = allClubs.find(c => c.id === clubId) || allClubs[0];

  const handleRegister = () => {
    setSelectedClub(club);
  };

  const confirmRegistration = async () => {
    setIsRegistering(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRegistering(false);
    setSelectedClub(null);
    navigate('/student/explore');
  };

  const categoryLabel = 
    club.category === 'tech' ? 'Kỹ thuật & Công nghệ' :
    club.category === 'creative' ? 'Sáng tạo & Cộng đồng' :
    club.category === 'language' ? 'Ngôn ngữ & Giao tiếp' :
    club.category === 'sport' ? 'Thể thao & Sức khỏe' : 'Khác';

  return (
    <StudentLayout
      title={club.name}
      subtitle="Thông tin chi tiết câu lạc bộ"
    >
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <Link to="/student/explore" className="transition hover:text-white">
            Khám phá CLB
          </Link>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-white">{club.name}</span>
        </nav>

        {/* Hero Section */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
                  {categoryLabel}
                </span>
                {club.badge && (
                  <span className="rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 px-3 py-1 text-xs font-semibold text-violet-200">
                    {club.badge}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white lg:text-4xl">{club.name}</h1>
              <p className="mt-3 text-slate-300">{club.description}</p>
            </div>
            <div className="flex flex-shrink-0 flex-col gap-3 lg:w-64">
              {club.recruiting ? (
                <button
                  onClick={handleRegister}
                  className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-base font-semibold text-white transition hover:shadow-lg hover:shadow-violet-500/30"
                >
                  Đăng ký tham gia
                </button>
              ) : (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-xl bg-slate-800 px-6 py-3 text-base font-semibold text-slate-400"
                >
                  Đã đóng đơn
                </button>
              )}
              <Link
                to="/student/explore"
                className="w-full rounded-xl border border-white/15 px-6 py-3 text-center text-base font-medium text-white transition hover:border-white/40 hover:bg-white/5"
              >
                Quay lại
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-sm">
            <p className="text-sm text-slate-400">Thành viên</p>
            <p className="mt-2 text-2xl font-bold text-white">{club.members}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-sm">
            <p className="text-sm text-slate-400">Hoạt động</p>
            <p className="mt-2 text-2xl font-bold text-blue-400">{club.activities}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-sm">
            <p className="text-sm text-slate-400">Chi phí</p>
            <p className="mt-2 text-2xl font-bold text-emerald-400">
              {club.fee === 0 ? 'Miễn phí' : `${(club.fee / 1000).toFixed(0)}k`}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* About Section */}
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-semibold text-white">Giới thiệu</h2>
            <p className="leading-relaxed text-slate-300">{club.fullDescription}</p>
          </div>
        </div>
      </div>

      {/* Registration Confirmation Dialog */}
      <Dialog open={selectedClub !== null} onOpenChange={(open) => !open && setSelectedClub(null)}>
        {selectedClub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedClub(null)} />
            <div className="relative z-10 w-full max-w-md">
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
                <h3 className="mb-4 text-xl font-bold text-white">Xác nhận đăng ký</h3>
                <p className="mb-6 text-slate-300">
                  Bạn có muốn đăng ký tham gia <span className="font-semibold text-violet-200">{selectedClub.name}</span> không?
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedClub(null)}
                    className="flex-1 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={confirmRegistration}
                    disabled={isRegistering}
                    className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isRegistering ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Đang xử lý...
                      </span>
                    ) : (
                      'Xác nhận'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </StudentLayout>
  );
}

export default StudentExploreDetailPage;

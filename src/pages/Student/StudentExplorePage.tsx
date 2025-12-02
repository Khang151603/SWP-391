import { useState } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import { Dialog } from '../../components/ui/Dialog';

const categories = [
  { id: 'all', label: 'Tất cả', count: 12 },
  { id: 'creative', label: 'Sáng tạo', count: 4 },
  { id: 'tech', label: 'Kỹ thuật', count: 3 },
  { id: 'language', label: 'Ngôn ngữ', count: 2 },
  { id: 'sport', label: 'Thể thao', count: 3 },
];

const allClubs = [
  {
    id: 'innovation',
    name: 'CLB Lập trình Sáng tạo',
    category: 'tech',
    description: 'Học và chia sẻ kinh nghiệm lập trình, xây dựng dự án thực tế',
    members: 127,
    activities: 2,
    fee: 500000,
    rating: 4.8,
    reviews: 45,
    tags: ['React', 'AI', 'Hackathon'],
    badge: 'Top Pick',
    nextEvent: 'Workshop React - 15/12',
    recruiting: true,
  },
  {
    id: 'english',
    name: 'CLB Tiếng Anh Giao tiếp',
    category: 'language',
    description: 'Rèn luyện kỹ năng giao tiếp tiếng Anh qua hoạt động thực tế',
    members: 95,
    activities: 3,
    fee: 350000,
    rating: 4.6,
    reviews: 38,
    tags: ['Speaking', 'TOEIC', 'Networking'],
    badge: 'Popular',
    nextEvent: 'English Club - 12/12',
    recruiting: true,
  },
  {
    id: 'design',
    name: 'CLB Thiết kế Đồ họa',
    category: 'creative',
    description: 'Sáng tạo các tác phẩm thiết kế chuyên nghiệp',
    members: 68,
    activities: 1,
    fee: 0,
    rating: 4.7,
    reviews: 29,
    tags: ['UI/UX', 'Photoshop', 'Illustrator'],
    badge: 'Free',
    nextEvent: 'Design Contest - 18/12',
    recruiting: true,
  },
  {
    id: 'volunteer',
    name: 'CLB Tình nguyện Xanh',
    category: 'creative',
    description: 'Hoạt động tình nguyện vì cộng đồng và môi trường',
    members: 156,
    activities: 2,
    fee: 0,
    rating: 4.9,
    reviews: 87,
    tags: ['Thiện nguyện', 'Môi trường', 'Cộng đồng'],
    badge: 'Top Rated',
    nextEvent: 'Mùa đông ấm - 10/12',
    recruiting: true,
  },
  {
    id: 'blockchain',
    name: 'CLB Blockchain & Web3',
    category: 'tech',
    description: 'Nghiên cứu và phát triển ứng dụng Blockchain',
    members: 82,
    activities: 1,
    fee: 400000,
    rating: 4.5,
    reviews: 31,
    tags: ['Blockchain', 'Smart Contract', 'DeFi'],
    badge: 'Popular',
    nextEvent: 'Seminar Web3 - 20/12',
    recruiting: false,
  },
  {
    id: 'football',
    name: 'CLB Bóng đá FPT',
    category: 'sport',
    description: 'Rèn luyện sức khỏe và kỹ năng bóng đá',
    members: 143,
    activities: 3,
    fee: 200000,
    rating: 4.6,
    reviews: 56,
    tags: ['Thể thao', 'Sức khỏe', 'Teamwork'],
    nextEvent: 'Giao hữu - Thứ 7',
    recruiting: true,
  },
];

const availabilityOptions = [
  { id: 'weekday-evening', label: 'Tối trong tuần', subtext: '18:00 - 21:00' },
  { id: 'weekday-morning', label: 'Sáng trong tuần', subtext: '07:30 - 11:00' },
  { id: 'weekend', label: 'Cuối tuần', subtext: 'Thứ 7 - Chủ nhật' },
  { id: 'hybrid', label: 'Hybrid', subtext: 'Online + Offline' },
  { id: 'remote', label: 'Online', subtext: 'Qua Teams/Zoom' },
];

function StudentExplorePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedClub, setSelectedClub] = useState<typeof allClubs[0] | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // Registration form data
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    major: '',
    year: '1',
    motivation: '',
    experience: '',
    availability: [] as string[],
    agreedToTerms: false,
  });

  const requiredFieldKeys: Array<keyof typeof formData> = ['fullName', 'studentId', 'email', 'phone', 'major', 'motivation'];
  const filledRequiredFields = requiredFieldKeys.filter((key) => {
    const value = formData[key];
    return typeof value === 'string' && value.trim() !== '';
  }).length;
  const completionPercentage = Math.min(
    100,
    Math.round(
      ((filledRequiredFields + (formData.availability.length ? 1 : 0) + (formData.agreedToTerms ? 1 : 0)) /
        (requiredFieldKeys.length + 2)) *
        100,
    ),
  );

  const filteredClubs = allClubs.filter((club) => {
    const matchesCategory = activeCategory === 'all' || club.category === activeCategory;
    const matchesSearch =
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleRegister = (club: typeof allClubs[0]) => {
    setSelectedClub(club);
    // Reset form
    setFormData({
      fullName: '',
      studentId: '',
      email: '',
      phone: '',
      major: '',
      year: '1',
      motivation: '',
      experience: '',
      availability: [],
      agreedToTerms: false,
    });
  };

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAvailability = (slotId: string) => {
    setFormData(prev => {
      const isSelected = prev.availability.includes(slotId);
      return {
        ...prev,
        availability: isSelected ? prev.availability.filter(id => id !== slotId) : [...prev.availability, slotId],
      };
    });
  };

  const isFormValid = () => {
    return formData.fullName.trim() !== '' &&
           formData.studentId.trim() !== '' &&
           formData.email.trim() !== '' &&
           formData.phone.trim() !== '' &&
           formData.major.trim() !== '' &&
           formData.motivation.trim() !== '' &&
           formData.availability.length > 0 &&
           formData.agreedToTerms;
  };

  const confirmRegistration = async () => {
    if (!isFormValid()) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsRegistering(true);
    // Simulate API call with form data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Registration data:', {
      club: selectedClub?.name,
      ...formData
    });
    
    setIsRegistering(false);
    setRegistrationSuccess(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setSelectedClub(null);
      setRegistrationSuccess(false);
    }, 3000);
  };

  return (
    <StudentLayout title="Khám phá CLB" subtitle="Tìm kiếm và tham gia CLB phù hợp với sở thích của bạn">
      <div className="space-y-6">
      
        {/* Search & View Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-md">
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên CLB, kỹ năng, tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-slate-400 backdrop-blur-sm transition focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-2 transition ${
                viewMode === 'grid' ? 'bg-violet-600 text-white' : 'border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-2 transition ${
                viewMode === 'list' ? 'bg-violet-600 text-white' : 'border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => {
            const getCategoryIcon = (id: string) => {
              switch(id) {
                case 'all':
                  return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  );
                case 'creative':
                  return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  );
                case 'tech':
                  return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  );
                case 'language':
                  return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  );
                case 'sport':
                  return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  );
                default:
                  return null;
              }
            };

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30'
                    : 'border border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${
                  activeCategory === cat.id ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Tìm thấy <span className="font-semibold text-white">{filteredClubs.length}</span> CLB
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Sắp xếp:</span>
            <select className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white backdrop-blur-sm focus:border-violet-500/50 focus:outline-none">
              <option>Phổ biến nhất</option>
              <option>Đánh giá cao</option>
              <option>Mới nhất</option>
              <option>Thành viên nhiều nhất</option>
            </select>
          </div>
        </div>

        {/* Clubs Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-violet-500/30 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-violet-500/10"
              >
                {/* Badge */}
                {club.badge && (
                  <div className="absolute right-4 top-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      club.badge === 'Top Pick' ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30' :
                      club.badge === 'Popular' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' :
                      club.badge === 'Free' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {club.badge === 'Top Pick' && (
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      )}
                      {club.badge === 'Popular' && (
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                      )}
                      {club.badge === 'Free' && (
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                        </svg>
                      )}
                      {club.badge === 'Top Rated' && (
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      {club.badge}
                    </span>
                  </div>
                )}

                {/* Club Icon */}
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 backdrop-blur-sm">
                  {club.category === 'tech' && (
                    <svg className="h-8 w-8 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  )}
                  {club.category === 'language' && (
                    <svg className="h-8 w-8 text-fuchsia-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  )}
                  {club.category === 'creative' && (
                    <svg className="h-8 w-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  )}
                  {club.category === 'sport' && (
                    <svg className="h-8 w-8 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white">{club.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">{club.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>Thành viên</span>
                    </div>
                    <p className="mt-1 text-lg font-bold text-white">{club.members}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>HĐ/tuần</span>
                    </div>
                    <p className="mt-1 text-lg font-bold text-white">{club.activities}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Phí tham gia</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {club.fee === 0 ? 'Miễn phí' : club.fee.toLocaleString() + 'đ'}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <Link
                    to={`/student/clubs/${club.id}`}
                    className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-white/5"
                  >
                    Chi tiết
                  </Link>
                  {club.recruiting ? (
                    <button 
                      onClick={() => handleRegister(club)}
                      className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:shadow-violet-500/50"
                    >
                      Đăng ký
                    </button>
                  ) : (
                    <button disabled className="flex-1 cursor-not-allowed rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-400">
                      Đã đóng
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                className="group flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-violet-500/30 hover:bg-white/[0.07] sm:flex-row"
              >
                {/* Left: Icon & Basic Info */}
                <div className="flex items-start gap-4">
                  <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 backdrop-blur-sm">
                    {club.category === 'tech' && (
                      <svg className="h-10 w-10 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    )}
                    {club.category === 'language' && (
                      <svg className="h-10 w-10 text-fuchsia-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                    )}
                    {club.category === 'creative' && (
                      <svg className="h-10 w-10 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    )}
                    {club.category === 'sport' && (
                      <svg className="h-10 w-10 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{club.name}</h3>
                      {club.badge && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          club.badge === 'Top Pick' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          club.badge === 'Popular' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' :
                          club.badge === 'Free' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {club.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">{club.description}</p>
                  </div>
                </div>

                {/* Right: Stats & Actions */}
                <div className="flex flex-col justify-between gap-4 sm:w-64 sm:flex-shrink-0">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <p className="text-xs text-slate-400">Thành viên</p>
                      <p className="text-lg font-bold text-white">{club.members}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400">HĐ/tuần</p>
                      <p className="text-lg font-bold text-white">{club.activities}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400">Phí tham gia</p>
                      <p className="text-lg font-bold text-emerald-400">{club.fee === 0 ? 'Miễn phí' : club.fee.toLocaleString() + 'đ'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/student/clubs/${club.id}`}
                      className="flex-1 rounded-xl border border-white/10 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-white/5"
                    >
                      Chi tiết
                    </Link>
                    {club.recruiting ? (
                      <button 
                        onClick={() => handleRegister(club)}
                        className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:shadow-violet-500/50"
                      >
                        Đăng ký
                      </button>
                    ) : (
                      <button disabled className="flex-1 cursor-not-allowed rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-400">
                        Đã đóng
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredClubs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-12 text-center backdrop-blur-sm">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="mb-2 text-lg font-semibold text-white">Không tìm thấy CLB</h4>
              <p className="text-sm text-slate-400">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Registration Dialog */}
      <Dialog open={selectedClub !== null} onOpenChange={(open) => !open && setSelectedClub(null)}>
        {selectedClub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedClub(null)} />
            <div className="relative z-10 w-full max-w-5xl">
              <div className="relative max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 shadow-2xl">
                <button
                  onClick={() => setSelectedClub(null)}
                  className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {!registrationSuccess ? (
                  <div className="grid h-full max-h-[90vh] grid-cols-1 overflow-hidden lg:grid-cols-[1.1fr_1.9fr]">
                    <aside className="flex flex-col gap-6 overflow-y-auto border-b border-white/5 bg-gradient-to-b from-violet-900/70 via-fuchsia-900/40 to-slate-950/80 px-6 py-8 text-white lg:border-b-0 lg:border-r">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-white/70">CLB bạn chọn</p>
                        <h3 className="mt-2 text-2xl font-bold">{selectedClub.name}</h3>
                        <p className="mt-2 text-sm text-white/70">{selectedClub.description}</p>
                      </div>

                      <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-lg shadow-violet-500/10">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                            {selectedClub.category === 'tech' && (
                              <svg className="h-6 w-6 text-violet-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                              </svg>
                            )}
                            {selectedClub.category === 'language' && (
                              <svg className="h-6 w-6 text-fuchsia-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                              </svg>
                            )}
                            {selectedClub.category === 'creative' && (
                              <svg className="h-6 w-6 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                              </svg>
                            )}
                            {selectedClub.category === 'sport' && (
                              <svg className="h-6 w-6 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-white/70">Độ phủ cộng đồng</p>
                            <p className="text-lg font-semibold">{selectedClub.members}+ thành viên</p>
                          </div>
                        </div>
                        <ul className="mt-4 grid grid-cols-2 gap-3 text-sm">
                          <li className="rounded-xl border border-white/10 bg-white/5 p-3">
                            <p className="text-xs text-white/60">Hoạt động/tuần</p>
                            <p className="text-lg font-semibold text-white">{selectedClub.activities}</p>
                          </li>
                          <li className="rounded-xl border border-white/10 bg-white/5 p-3">
                            <p className="text-xs text-white/60">Chi phí</p>
                            <p className="text-lg font-semibold text-emerald-300">
                              {selectedClub.fee === 0 ? 'Miễn phí' : `${selectedClub.fee.toLocaleString()}đ`}
                            </p>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Focus tags</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedClub.tags?.map(tag => (
                            <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                        <div className="flex items-center justify-between text-sm text-white/70">
                          <span>Tiến độ hồ sơ</span>
                          <span className="font-semibold text-white">{completionPercentage}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-violet-500 transition-all" style={{ width: `${completionPercentage}%` }} />
                        </div>
                        <p className="mt-2 text-xs text-white/60">Điền đầy đủ thông tin & chọn lịch tham gia để đạt 100%</p>
                      </div>

                      <div className="rounded-2xl border border-amber-300/40 bg-amber-400/10 p-4 text-sm text-amber-100">
                        <p className="font-semibold text-amber-200">Sự kiện sắp tới</p>
                        <p className="mt-1 text-2xl font-bold text-white">{selectedClub.nextEvent ?? 'Sự kiện nội bộ tuần này'}</p>
                        <p className="mt-2 text-xs text-amber-100/90">
                          Đăng ký sớm để giữ chỗ và nhận thông báo chi tiết qua email.
                        </p>
                      </div>
                    </aside>

                    <section className="flex flex-col overflow-y-auto px-6 py-6">
                      <header className="pb-5">
                        <span className="text-xs uppercase tracking-[0.4em] text-slate-400">Đơn đăng ký</span>
                        <h3 className="mt-2 text-3xl font-semibold text-white">Tạo hồ sơ tham gia</h3>
                        <p className="mt-2 text-sm text-slate-400">
                          Thông tin càng chi tiết, Ban Quản Lý càng dễ kết nối bạn với nhóm phù hợp.
                        </p>
                      </header>

                      <div className="space-y-6">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <h5 className="flex items-center gap-2 text-sm font-semibold text-white">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-xs text-violet-300">1</span>
                            Thông tin cá nhân
                          </h5>
                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">Họ và tên *</label>
                              <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => handleFormChange('fullName', e.target.value)}
                                placeholder="Nguyễn Văn A"
                                className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">Mã sinh viên *</label>
                              <input
                                type="text"
                                value={formData.studentId}
                                onChange={(e) => handleFormChange('studentId', e.target.value)}
                                placeholder="SE123456"
                                className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">Email *</label>
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleFormChange('email', e.target.value)}
                                placeholder="nguyenvana@fpt.edu.vn"
                                className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">Số điện thoại *</label>
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleFormChange('phone', e.target.value)}
                                placeholder="0912345678"
                                className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">Chuyên ngành *</label>
                              <input
                                type="text"
                                value={formData.major}
                                onChange={(e) => handleFormChange('major', e.target.value)}
                                placeholder="Software Engineering"
                                className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">Năm học *</label>
                              <select
                                value={formData.year}
                                onChange={(e) => handleFormChange('year', e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                              >
                                <option value="1">Năm 1</option>
                                <option value="2">Năm 2</option>
                                <option value="3">Năm 3</option>
                                <option value="4">Năm 4</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <h5 className="flex items-center gap-2 text-sm font-semibold text-white">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-xs text-violet-300">2</span>
                            Mục tiêu & kinh nghiệm
                          </h5>
                          <div className="mt-4 space-y-4">
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">Lý do tham gia *</label>
                              <textarea
                                value={formData.motivation}
                                onChange={(e) => handleFormChange('motivation', e.target.value)}
                                rows={4}
                                placeholder="Chia sẻ bạn mong muốn điều gì khi tham gia CLB..."
                                className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-400">Kinh nghiệm liên quan</label>
                              <textarea
                                value={formData.experience}
                                onChange={(e) => handleFormChange('experience', e.target.value)}
                                rows={3}
                                placeholder="Kể về kỹ năng, dự án, thành tựu liên quan..."
                                className="w-full rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <h5 className="flex items-center gap-2 text-sm font-semibold text-white">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-xs text-violet-300">3</span>
                            Thời gian & cam kết
                          </h5>
                          <p className="mt-2 text-sm text-slate-400">Chọn khung thời gian bạn có thể tham gia hoạt động định kỳ.</p>

                          <div className="mt-4 grid gap-3 lg:grid-cols-2">
                            {availabilityOptions.map(slot => {
                              const isSelected = formData.availability.includes(slot.id);
                              return (
                                <button
                                  key={slot.id}
                                  type="button"
                                  onClick={() => toggleAvailability(slot.id)}
                                  aria-pressed={isSelected}
                                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                                    isSelected
                                      ? 'border-emerald-400/60 bg-emerald-400/15 text-white shadow-lg shadow-emerald-500/20'
                                      : 'border-white/10 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10'
                                  }`}
                                >
                                  <p className="text-sm font-semibold">{slot.label}</p>
                                  <p className="text-xs text-white/60">{slot.subtext}</p>
                                </button>
                              );
                            })}
                          </div>

                          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                            <label className="flex cursor-pointer items-start gap-3">
                              <input
                                type="checkbox"
                                checked={formData.agreedToTerms}
                                onChange={(e) => handleFormChange('agreedToTerms', e.target.checked)}
                                className="mt-1 h-5 w-5 rounded border-white/20 bg-slate-900/40 text-violet-600 focus:ring-2 focus:ring-violet-500/20 focus:ring-offset-0"
                              />
                              <span className="text-sm text-slate-300">
                                Tôi cam kết tham gia đầy đủ hoạt động, tuân thủ nội quy và hoàn tất phí nếu có. <span className="text-red-400">*</span>
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4 rounded-2xl border border-blue-400/30 bg-blue-950/40 p-5 text-sm text-blue-100">
                        <div className="flex items-center gap-3">
                          <svg className="h-5 w-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p>Ban Quản Lý sẽ phản hồi qua email trong 24-48 giờ. Bạn có thể theo dõi trạng thái tại trang “Đơn của tôi”.</p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 border-t border-white/5 pt-5 sm:flex-row">
                        <button
                          onClick={() => setSelectedClub(null)}
                          className="w-full rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                        >
                          Để sau
                        </button>
                        <button
                          onClick={confirmRegistration}
                          disabled={isRegistering || !isFormValid()}
                          className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:shadow-violet-500/60 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isRegistering ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Đang gửi
                            </span>
                          ) : (
                            'Gửi đơn ngay'
                          )}
                        </button>
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-6 px-8 py-16 text-center text-white">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-emerald-400/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="h-12 w-12 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm uppercase tracking-[0.5em] text-emerald-200">Hoàn tất</p>
                      <h4 className="text-3xl font-bold">Đăng ký thành công!</h4>
                      <p className="text-base text-slate-300">
                        Cảm ơn bạn đã đăng ký tham gia <span className="text-violet-200">{selectedClub.name}</span>. Chúng tôi sẽ gửi phản hồi sớm nhất qua email.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedClub(null);
                        setRegistrationSuccess(false);
                      }}
                      className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                    >
                      Đóng cửa sổ
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </StudentLayout>
  );
}

export default StudentExplorePage;




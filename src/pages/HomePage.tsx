import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clubService } from '../api/services/club.service';
import { useAppContext } from '../context/AppContext';
import type { ClubListItem } from '../api/types/club.types';

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, selectedRole } = useAppContext();
  const [clubs, setClubs] = useState<ClubListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await clubService.getAllClubs();
        setClubs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải danh sách câu lạc bộ');
        console.error('Error fetching clubs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Modern Sticky Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/50' 
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 opacity-100 group-hover:opacity-90 transition-opacity duration-300"></div>
                <div className="relative rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-2.5 shadow-lg shadow-blue-500/30">
                  <span className="text-xl font-bold text-white tracking-tight">SCMS</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 leading-tight">
                  Student Club
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 leading-tight">
                  Management System
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => scrollToSection('clubs')}
                className="px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors duration-200"
              >
                Câu lạc bộ
              </button>
              <a
                href="#about"
                className="px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors duration-200"
              >
                Về chúng tôi
              </a>
              <a
                href="#contact"
                className="px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors duration-200"
              >
                Liên hệ
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      const normalizedRole = selectedRole?.toLowerCase().replace(/\s+/g, '') || '';
                      if (normalizedRole === 'student') {
                        navigate('/student');
                      } else if (normalizedRole === 'clubleader') {
                        navigate('/leader');
                      } else {
                        navigate('/select-role');
                      }
                    }}
                    className="px-5 py-2.5 text-sm font-semibold text-slate-700 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={async () => {
                      await logout();
                      navigate('/');
                    }}
                    className="group relative px-6 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2 text-white">
                      <span className="text-white">Đăng xuất</span>
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 text-sm font-semibold text-slate-700 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="group relative px-6 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2 text-white">
                      <span className="text-white">Đăng ký</span>
                      <svg className="h-4 w-4 text-white transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md">
              <div className="px-4 py-4 space-y-2">
                <button
                  onClick={() => scrollToSection('clubs')}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Câu lạc bộ
                </button>
                <a
                  href="#about"
                  className="block px-4 py-3 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Về chúng tôi
                </a>
                <a
                  href="#contact"
                  className="block px-4 py-3 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Liên hệ
                </a>
                <div className="pt-2 space-y-2 border-t border-slate-200">
                  {isAuthenticated ? (
                    <>
                      <button
                        onClick={() => {
                          const normalizedRole = selectedRole?.toLowerCase().replace(/\s+/g, '') || '';
                          if (normalizedRole === 'student') {
                            navigate('/student');
                          } else if (normalizedRole === 'clubleader') {
                            navigate('/leader');
                          } else {
                            navigate('/select-role');
                          }
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full px-4 py-3 text-sm font-semibold text-center text-slate-700 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={async () => {
                          await logout();
                          navigate('/');
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full px-4 py-3 text-sm font-semibold text-center text-white rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all"
                      >
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block w-full px-4 py-3 text-sm font-semibold text-center text-slate-700 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        className="block w-full px-4 py-3 text-sm font-semibold text-center text-white rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Đăng ký tài khoản
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative pt-20 pb-12 lg:pt-32 lg:pb-20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[max(50%,25rem)] top-0 h-[40rem] w-[40rem] -translate-x-1/2 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className="text-center">
            <div className="space-y-6">
              <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
                Quản lý câu lạc bộ trong{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  trường đại học
                </span>
              </h1>

            </div>
          </section>
        </div>
      </div>
      <main className="relative z-10 mx-auto max-w-6xl space-y-16 px-6 py-12">
        <section id="clubs" className="space-y-10">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">CÂU LẠC BỘ</p>
            <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">Tham gia câu lạc bộ phù hợp với bạn</h2>
            <p className="mx-auto max-w-3xl text-base text-slate-600">
              Khám phá các câu lạc bộ đang hoạt động trong trường, tìm hiểu về hoạt động và đăng ký tham gia ngay hôm nay.
            </p>
          </div>
          {loading && (
            <div className="text-center py-12">
              <p className="text-slate-600">Đang tải danh sách câu lạc bộ...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {clubs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-600">Chưa có câu lạc bộ nào.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {clubs.map((club) => (
                    <div
                      key={club.id}
                      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                    >
                      <div className="relative">
                        {club.imageClubsUrl && (
                          <div className="mb-4 overflow-hidden rounded-lg">
                            <img
                              src={club.imageClubsUrl}
                              alt={club.name}
                              className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-slate-900 mb-1">{club.name}</h3>
                        </div>
                        <p className="mb-4 text-sm text-slate-600 line-clamp-2">{club.description}</p>
                        <div className="mb-4 flex items-center gap-4 text-sm text-slate-500">
                          <span>{club.memberCount || 0} thành viên</span>
                        </div>
                        <div className="mb-4 rounded-lg bg-amber-50 px-3 py-2 border border-amber-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-600">Phí tham gia</span>
                            <span className="text-sm font-semibold text-amber-700">
                              {club.membershipFee === 0 ? (
                                <span className="text-emerald-700">Miễn phí</span>
                              ) : (
                                <span>{club.membershipFee.toLocaleString('vi-VN')} ₫</span>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 border border-emerald-200">
                          <p className="text-xs font-medium text-emerald-700">
                            {club.status === 'Active' ? 'Đang tuyển thành viên' : club.status}
                          </p>
                        </div>
                        {isAuthenticated ? (
                          <Link
                            to="/student/explore"
                            className="block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
                          >
                            Xem chi tiết
                          </Link>
                        ) : (
                          <Link
                            to="/register"
                            className="block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
                          >
                            Tham gia ngay
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-600 p-2.5 ring-2 ring-blue-100">
                  <span className="text-lg font-bold text-white">SCMS</span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Student Club
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Management System
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                Nền tảng quản lý câu lạc bộ dành cho sinh viên Việt Nam. Kết nối, phát triển và quản lý các hoạt động câu lạc bộ một cách hiệu quả.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">Liên kết nhanh</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-sm text-slate-600 transition hover:text-blue-600">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-sm text-slate-600 transition hover:text-blue-600">
                    Đăng ký tài khoản
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-sm text-slate-600 transition hover:text-blue-600">
                    Đăng nhập
                  </Link>
                </li>
                <li>
                  <a href="#clubs" className="text-sm text-slate-600 transition hover:text-blue-600">
                    Câu lạc bộ
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">Hỗ trợ</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-slate-600 transition hover:text-blue-600">
                    Hướng dẫn sử dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 transition hover:text-blue-600">
                    Câu hỏi thường gặp
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 transition hover:text-blue-600">
                    Liên hệ hỗ trợ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 transition hover:text-blue-600">
                    Chính sách bảo mật
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">Liên hệ</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-slate-600">support@scms.edu.vn</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm text-slate-600">1900-xxxx</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-slate-600">Trường Đại học</span>
                </li>
              </ul>
              <div className="flex items-center gap-3 pt-2">
                <a href="#" className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-blue-100 hover:text-blue-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-blue-100 hover:text-blue-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-blue-100 hover:text-blue-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 border-t border-slate-200 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-slate-600">
                © {new Date().getFullYear()} SCMS. Tất cả quyền được bảo lưu.
              </p>
              <div className="flex items-center gap-6 text-sm text-slate-600">
                <a href="#" className="transition hover:text-blue-600">
                  Điều khoản sử dụng
                </a>
                <a href="#" className="transition hover:text-blue-600">
                  Chính sách bảo mật
                </a>
                <a href="#" className="transition hover:text-blue-600">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;



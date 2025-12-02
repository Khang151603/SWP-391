import LeaderLayout from '../../components/layout/LeaderLayout';

const clubProfile = {
  name: 'CLB Truyền thông',
  tagline: 'Media Lab • Creative & Impactful',
  description:
    'Tạo ra các chiến dịch truyền thông sáng tạo, kết nối sinh viên với hoạt động cộng đồng và xây dựng hình ảnh trường năng động.',
  stats: {
    members: 84,
    activitiesPerMonth: 12,
    rating: 4.9,
  },
  goals: [
    'Tổ chức tối thiểu 2 chiến dịch truyền thông lớn mỗi học kỳ',
    'Xây dựng đội ngũ mentor nội bộ cho member mới',
    'Mở rộng mạng lưới đối tác doanh nghiệp về truyền thông số',
  ],
  contact: {
    email: 'leader.media@university.edu.vn',
    phone: '0966 888 123',
    facebook: 'facebook.com/clb-truyen-thong',
    workspace: 'Notion: clubos.cc/medialab',
  },
  cover: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&q=80&w=1200',
};

function ClubLeaderInfoPage() {
  return (
    <LeaderLayout
      title="Quản lý hồ sơ CLB"
      subtitle="Thiết lập thông tin hiển thị với sinh viên, nhà trường và trên trang truyền thông"
    >
      <div className="space-y-8">
        {/* Main layout: form + live preview */}
        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Left: form area */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.9)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-orange-100/80">Thông tin hiển thị</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Thông tin cơ bản của CLB</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Tên, tagline và mô tả sẽ xuất hiện trong danh sách CLB cũng như các chiến dịch truyền thông.
                  </p>
                </div>
                <button className="hidden rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-slate-100 hover:bg-white/10 md:inline-flex">
                  Xem trước ở trang sinh viên
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block text-sm text-slate-200">
                  Tên CLB
                  <input
                    defaultValue={clubProfile.name}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                    placeholder="Ví dụ: CLB Truyền thông"
                  />
                </label>

                <label className="block text-sm text-slate-200">
                  Tagline / Câu mô tả ngắn
                  <input
                    defaultValue={clubProfile.tagline}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                    placeholder="Câu giới thiệu nhanh về CLB (tối đa 80 ký tự)"
                  />
                  <p className="mt-1 text-[0.7rem] text-slate-400">Hiển thị ở list CLB & card sự kiện.</p>
                </label>

                <label className="block text-sm text-slate-200">
                  Mô tả chi tiết
                  <textarea
                    defaultValue={clubProfile.description}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                    rows={5}
                    placeholder="Giới thiệu sứ mệnh, hoạt động nổi bật, văn hoá và giá trị mà CLB mang lại cho sinh viên."
                  />
                  <div className="mt-1 flex items-center justify-between text-[0.7rem] text-slate-400">
                    <span>Nên giữ trong khoảng 3–6 câu để sinh viên dễ đọc nhanh.</span>
                    <span>~ 220/600 ký tự</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Goals section */}
            <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">Mục tiêu trọng tâm trong năm</h3>
                  <p className="text-xs text-slate-400">
                    Chọn 3–5 mục tiêu chiến lược để hiển thị với nhà trường và trong báo cáo tổng kết.
                  </p>
                </div>
                <div className="flex gap-2 text-xs">
                  <button className="rounded-2xl border border-white/15 bg-white/5 px-3 py-1.5 text-slate-100 hover:bg-white/10">
                    Nhập từ file
                  </button>
                  <button className="rounded-2xl bg-fuchsia-500 px-3 py-1.5 font-semibold text-white hover:bg-fuchsia-400">
                    + Thêm mục tiêu
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-100">
                {clubProfile.goals.map((goal, index) => (
                  <div
                    key={goal}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="flex gap-3">
                      <span className="mt-0.5 h-6 w-6 rounded-full bg-slate-900/70 text-center text-xs font-semibold text-slate-200 ring-1 ring-white/15">
                        {index + 1}
                      </span>
                      <p className="text-sm text-slate-100">{goal}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-[0.7rem]">
                      <button className="rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-100 hover:bg-emerald-500/20">
                        Đặt làm trọng tâm
                      </button>
                      <button className="text-slate-400 hover:text-slate-200">Chỉnh sửa</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: live preview card */}
          <aside className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-300">
              <p className="text-[0.7rem] uppercase tracking-[0.3em] text-slate-400">Xem trước</p>
              <p className="mt-1 text-sm text-slate-200">
                Giao diện mô phỏng card CLB mà sinh viên sẽ thấy trong màn hình khám phá.
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-[0_24px_80px_rgba(15,23,42,1)]">
              <div className="relative h-40 w-full overflow-hidden">
                <img src={clubProfile.cover} alt="Club cover" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.25em] text-orange-100/90">Media & Communication</p>
                    <h2 className="mt-1 text-lg font-semibold text-white">{clubProfile.name}</h2>
                    <p className="text-xs text-slate-200/90">{clubProfile.tagline}</p>
                  </div>
                  <span className="rounded-full bg-black/50 px-3 py-1 text-[0.7rem] font-medium text-emerald-200 ring-1 ring-emerald-400/50">
                    Đang tuyển member
                  </span>
                </div>
              </div>

              <div className="space-y-3 p-4 text-xs text-slate-200">
                <p className="line-clamp-3 text-slate-200/90">{clubProfile.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[0.7rem] text-fuchsia-200 ring-1 ring-fuchsia-400/40">
                    {clubProfile.stats.members} thành viên
                  </span>
                  <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[0.7rem] text-amber-200 ring-1 ring-amber-400/40">
                    {clubProfile.stats.activitiesPerMonth} hoạt động/tháng
                  </span>
                  <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[0.7rem] text-emerald-200 ring-1 ring-emerald-400/40">
                    Đánh giá {clubProfile.stats.rating}/5
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1 text-[0.7rem] text-slate-400">
                    <span>#content</span>
                    <span>#event</span>
                    <span>#social</span>
                  </div>
                  <button className="rounded-full bg-white px-3 py-1 text-[0.7rem] font-semibold text-slate-900 hover:bg-white/90">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-300">
              <p className="text-[0.7rem] font-medium text-slate-200">Trạng thái hiển thị</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-[0.7rem] font-semibold text-emerald-100 ring-1 ring-emerald-400/50">
                  Hiển thị với tất cả sinh viên
                </button>
                <button className="rounded-full bg-white/5 px-3 py-1.5 text-[0.7rem] text-slate-200 hover:bg-white/10">
                  Ẩn với sinh viên ngoài trường
                </button>
              </div>
            </div>
          </aside>
        </section>

        {/* Contact section */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/85 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Thông tin liên hệ & kênh truyền thông</h3>
              <p className="text-xs text-slate-400">
                Cập nhật email, số điện thoại và workspace nội bộ để Ban cố vấn & sinh viên dễ dàng kết nối.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button className="rounded-2xl border border-white/15 bg-white/5 px-3 py-1.5 text-slate-100 hover:bg-white/10">
                Đồng bộ từ website trường
              </button>
              <button className="rounded-2xl border border-sky-400/60 bg-sky-500/10 px-3 py-1.5 font-semibold text-sky-100 hover:bg-sky-500/20">
                Gửi bản PDF giới thiệu
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-200">
              Email chính thức của CLB
              <input
                defaultValue={clubProfile.contact.email}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                placeholder="Ví dụ: clb.media@university.edu.vn"
              />
              <p className="mt-1 text-[0.7rem] text-slate-400">Dùng cho trao đổi với phòng CTSV & đối tác.</p>
            </label>

            <label className="text-sm text-slate-200">
              Số điện thoại liên hệ
              <input
                defaultValue={clubProfile.contact.phone}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                placeholder="Số trưởng ban/ban đối ngoại"
              />
              <p className="mt-1 text-[0.7rem] text-slate-400">Hiển thị cho sinh viên sau khi đăng ký tham gia.</p>
            </label>

            <label className="text-sm text-slate-200">
              Trang Facebook / Fanpage
              <input
                defaultValue={clubProfile.contact.facebook}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                placeholder="Link tới fanpage chính thức"
              />
            </label>

            <label className="text-sm text-slate-200">
              Workspace nội bộ (Notion, ClickUp...)
              <input
                defaultValue={clubProfile.contact.workspace}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                placeholder="Link workspace để Ban chủ nhiệm và core-team sử dụng"
              />
            </label>
          </div>
        </section>

        {/* Action bar */}
        <section className="flex flex-col justify-between gap-3 border-t border-white/10 pt-4 text-sm text-slate-200 md:flex-row md:items-center">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Thay đổi gần đây chưa được đồng bộ lên website trường.</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-100 hover:bg-white/10">
              Khôi phục bản gần nhất
            </button>
            <button className="rounded-2xl bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-orange-500/20 hover:bg-white/95">
              Lưu & cập nhật hiển thị
            </button>
          </div>
        </section>
      </div>
    </LeaderLayout>
  );
}

export default ClubLeaderInfoPage;

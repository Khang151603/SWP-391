import LeaderLayout from '../../components/layout/LeaderLayout';

const clubProfile = {
  name: 'CLB Truyền thông',
  description:
    'Tạo ra các chiến dịch truyền thông sáng tạo, kết nối sinh viên với hoạt động cộng đồng và xây dựng hình ảnh trường năng động.',
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
  cover: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&q=80&w=1000',
};

function ClubLeaderInfoPage() {
  return (
    <LeaderLayout title="Quản lý thông tin CLB" subtitle="Cập nhật mô tả, mục tiêu, hình ảnh và thông tin liên hệ">
      <div className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Thông tin cơ bản</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{clubProfile.name}</h2>
            <p className="mt-3 text-sm text-slate-300">{clubProfile.description}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-fuchsia-200">84 thành viên</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-amber-200">
                12 hoạt động/ tháng
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-emerald-200">
                Điểm đánh giá 4.9/5
              </span>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <img src={clubProfile.cover} alt="Club cover" className="h-full w-full object-cover" />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Mô tả & Mục tiêu</h3>
              <p className="text-sm text-slate-400">Chỉnh sửa nội dung hiển thị với sinh viên và nhà trường</p>
            </div>
            <button className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10">Lưu</button>
          </div>
          <div className="mt-4 space-y-4">
            <label className="block text-sm text-slate-300">
              Mô tả chi tiết
              <textarea
                defaultValue={clubProfile.description}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300 focus:outline-none"
                rows={4}
              />
            </label>
            <div>
              <p className="text-sm text-slate-300">Mục tiêu trọng tâm</p>
              <div className="mt-3 space-y-2">
                {clubProfile.goals.map((goal) => (
                  <div key={goal} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
                    {goal}
                  </div>
                ))}
                <button className="text-sm text-fuchsia-200 hover:text-white">+ Thêm mục tiêu</button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Thông tin liên hệ</h3>
            <button className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10">
              Đồng bộ website
            </button>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {Object.entries(clubProfile.contact).map(([label, value]) => (
              <label key={label} className="text-sm text-slate-300">
                {label}
                <input
                  defaultValue={value}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-fuchsia-300 focus:outline-none"
                />
              </label>
            ))}
          </div>
        </section>
      </div>
    </LeaderLayout>
  );
}

export default ClubLeaderInfoPage;



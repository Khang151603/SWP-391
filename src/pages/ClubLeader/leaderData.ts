export const clubMetrics = [
  {
    title: 'Tổng thành viên',
    value: '84',
    change: '+6 kể từ tháng trước',
    highlight: 'Tỷ lệ duy trì 93%',
  },
  {
    title: 'Hoạt động tháng này',
    value: '12',
    change: '4 hoạt động đang mở',
    highlight: '3 hoạt động cần duyệt ngân sách',
  },
  {
    title: 'Tình trạng thu phí',
    value: '78%',
    change: '26/34 đã đóng phí Media Cup',
    highlight: 'Còn 8 thành viên chưa hoàn tất',
  },
];

export const pendingApplications = [
  {
    name: 'Trần Minh Khoa',
    studentId: 'SE151203',
    submittedAt: '30/11/2025',
    interest: 'Ban Sự kiện',
    note: 'Đã tham gia 4 sự kiện trường và có kinh nghiệm điều phối hậu cần.',
  },
  {
    name: 'Nguyễn Thảo Nhi',
    studentId: 'SE151255',
    submittedAt: '29/11/2025',
    interest: 'Ban Nội dung',
    note: 'Quan tâm đến sản xuất nội dung mạng xã hội, IELTS 7.5.',
  },
  {
    name: 'Phạm Hoàng Long',
    studentId: 'SE151198',
    submittedAt: '28/11/2025',
    interest: 'Ban Truyền thông',
    note: 'Từng làm leader Media Cup Gen 5, mạnh về quay dựng.',
  },
];

export const memberRoles = ['Thành viên', 'Leader', 'Phó Leader', 'Trưởng ban', 'Thành viên dự bị'];

export const memberStatuses = ['Active', 'Inactive', 'Pending', 'Offboarded'];

export const memberRoster = [
  {
    name: 'Vũ Đức Anh',
    studentId: 'SE150999',
    joinedAt: '08/2023',
    role: 'Leader',
    department: 'Điều hành',
    status: 'Active',
  },
  {
    name: 'Bùi Thảo Chi',
    studentId: 'SE151045',
    joinedAt: '03/2024',
    role: 'Phó Leader',
    department: 'Nội dung',
    status: 'Active',
  },
  {
    name: 'Ngô Duy Khánh',
    studentId: 'SE151078',
    joinedAt: '01/2024',
    role: 'Trưởng ban Sự kiện',
    department: 'Sự kiện',
    status: 'Active',
  },
  {
    name: 'Trần Ngọc Ánh',
    studentId: 'SE151120',
    joinedAt: '05/2024',
    role: 'Thành viên',
    department: 'Truyền thông',
    status: 'Pending',
  },
];

export const activityPipeline = [
  {
    title: 'Orientation 2025',
    schedule: '12/12 • 07:30',
    location: 'Hội trường A',
    budget: '8.500.000đ',
    fee: 'Không thu phí',
    status: 'Đang chuẩn bị',
  },
  {
    title: 'Media Cup 2025',
    schedule: '20/12 • 18:00',
    location: 'Sân vận động',
    budget: '12.000.000đ',
    fee: '250.000đ/người',
    status: 'Đang tuyển TNV',
  },
  {
    title: 'Green Campus',
    schedule: '05/01 • 06:30',
    location: 'Khuôn viên B',
    budget: '4.200.000đ',
    fee: '50.000đ/người',
    status: 'Chờ phê duyệt',
  },
];

export const financeOverview = [
  { label: 'Tổng thu tháng 11', value: '18.450.000đ', trend: '+12% so với T10' },
  { label: 'Công nợ hiện tại', value: '3.150.000đ', trend: '8 thành viên chưa đóng' },
  { label: 'Quỹ dự phòng', value: '9.800.000đ', trend: 'Đã khóa sổ đến 30/11' },
];

export const feeTracking = [
  {
    member: 'Nguyễn Hải Đăng',
    activity: 'Media Cup 2025',
    amount: '250.000đ',
    dueDate: '05/12',
    status: 'Đã đóng',
  },
  {
    member: 'Lê Thảo My',
    activity: 'Media Cup 2025',
    amount: '250.000đ',
    dueDate: '05/12',
    status: 'Chưa đóng',
  },
  {
    member: 'Team Nội dung',
    activity: 'Quỹ thường niên',
    amount: '1.500.000đ',
    dueDate: '10/12',
    status: 'Đang xử lý',
  },
];

export const reportHighlights = [
  {
    title: 'Tăng trưởng thành viên',
    value: '+18%',
    detail: 'Tuyển mới 12/20 mục tiêu quý IV',
  },
  {
    title: 'Tỷ lệ tham gia hoạt động',
    value: '87%',
    detail: 'Tăng 9% nhờ chiến dịch mentoring',
  },
  {
    title: 'Tổng thu hoạt động',
    value: '42.600.000đ',
    detail: 'Gồm Media Cup, Workshop Storytelling',
  },
];

export const exportTemplates = [
  { name: 'Báo cáo thành viên chi tiết', description: 'Xuất danh sách thành viên + KPI, trạng thái' },
  { name: 'Dòng tiền hoạt động', description: 'Theo dõi thu chi, công nợ theo sự kiện' },
  { name: 'Biên bản hoạt động', description: 'Checklist nội dung, nhân sự, KPI cho từng sự kiện' },
];



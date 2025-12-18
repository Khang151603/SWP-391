import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import StudentLayout from "../../components/layout/StudentLayout";
import { Dialog } from "../../components/ui/Dialog";
import { clubService } from "../../api/services/club.service";
import { membershipService } from "../../api/services/membership.service";
import type { ClubListItem } from "../../api/types/club.types";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

// Extended club type for UI display
interface DisplayClub {
  id: string;
  name: string;
  description: string;
  members?: number;
  fee: number;
  recruiting: boolean;
  imageUrl?: string | null;
  establishedDate?: string;
  location?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  activityFrequency?: string | null;
  totalRevenue?: number;
}

// Detailed club response from API
interface DetailedClubResponse extends ClubListItem {
  location?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  activityFrequency?: string | null;
  totalRevenue?: number;
  memberCount?: number;
}

function StudentExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [clubs, setClubs] = useState<DisplayClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClub, setSelectedClub] = useState<DisplayClub | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [myClubIds, setMyClubIds] = useState<number[]>([]);
  const [showMemberAlert, setShowMemberAlert] = useState(false);
  const [attemptedClubName, setAttemptedClubName] = useState("");
  const [viewDetailsClub, setViewDetailsClub] = useState<DisplayClub | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Debug: Log when component renders
  console.log("StudentExplorePage render - showMemberAlert:", showMemberAlert);

  // Registration form data
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    email: "",
    phone: "",
    major: "",
    skills: "",
    year: "1",
    motivation: "",
    experience: "",
    availability: [] as string[],
    agreedToTerms: false,
  });

  // Only validate fields required by API: fullName, email, phone, motivation (reason)

  // Fetch my clubs to check membership
  useEffect(() => {
    const fetchMyClubs = async () => {
      try {
        const myClubs = await membershipService.getStudentMyClubs();
        const clubIds = myClubs.map((item) => item.club.id);
        setMyClubIds(clubIds);
      } catch (error) {
        console.error("Failed to fetch my clubs:", error);
      }
    };
    fetchMyClubs();
  }, []);

  // Fetch account info for form pre-fill (only fullName, email, phone)
  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const accountInfo = await membershipService.getAccountInfo();
        // Auto-fill form data with account info (only 3 fields)
        setFormData((prev) => ({
          ...prev,
          fullName: accountInfo.fullName || "",
          email: accountInfo.email || "",
          phone: accountInfo.phone || "",
        }));
      } catch (error) {
        console.error("Failed to fetch account info:", error);
      }
    };
    fetchAccountInfo();
  }, []);

  // Fetch clubs from API
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiClubs = await clubService.getAllClubs();

        // Map API response to display format
        const mappedClubs: DisplayClub[] = apiClubs.map(
          (club: ClubListItem & {
            location?: string | null;
            contactEmail?: string | null;
            contactPhone?: string | null;
            activityFrequency?: string | null;
            totalRevenue?: number;
          }) => ({
            id: club.id.toString(),
            name: club.name,
            description: club.description,
            members: club.memberCount,
            fee: club.membershipFee,
            recruiting: club.status?.toLowerCase() === "active",
            imageUrl: club.imageClubsUrl,
            establishedDate: club.establishedDate,
            location: club.location,
            contactEmail: club.contactEmail,
            contactPhone: club.contactPhone,
            activityFrequency: club.activityFrequency,
            totalRevenue: club.totalRevenue,
          })
        );

        setClubs(mappedClubs);
      } catch {
        const message = "Không thể tải danh sách CLB. Vui lòng thử lại sau.";
        setError(message);
        showErrorToast(message);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  // Update search query when URL params change
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  const filteredClubs = clubs.filter((club) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      club.name.toLowerCase().includes(query) ||
      club.description.toLowerCase().includes(query)
    );
  });

  const handleRegister = (club: DisplayClub) => {
    // Check if already a member
    const clubId = parseInt(club.id);
    console.log(
      "handleRegister called for club:",
      club.name,
      "clubId:",
      clubId
    );
    console.log("myClubIds:", myClubIds);
    console.log("Is member?", myClubIds.includes(clubId));

    if (myClubIds.includes(clubId)) {
      setAttemptedClubName(club.name);
      setShowMemberAlert(true);
      return;
    }

    setSelectedClub(club);
    // Reset form but keep auto-filled account info (only 3 fields)
    setFormData((prev) => ({
      fullName: prev.fullName,
      studentId: "",
      email: prev.email,
      phone: prev.phone,
      major: "",
      skills: "",
      year: "1",
      motivation: "",
      experience: "",
      availability: [],
      agreedToTerms: false,
    }));
  };

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    // Only validate fields required by API
    return (
      formData.fullName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.motivation.trim() !== ""
    );
  };

  const confirmRegistration = async () => {
    if (!isFormValid() || !selectedClub) {
      const message = "Vui lòng điền đầy đủ thông tin bắt buộc";
      setRegistrationError(message);
      showErrorToast(message);
      return;
    }

    setIsRegistering(true);
    setRegistrationError(null);
    try {
      // Call API to create membership request
      await membershipService.createStudentRequest({
        clubId: parseInt(selectedClub.id),
        reason: formData.motivation,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        major: formData.major || undefined,
        skills: formData.skills || undefined,
      });

      setRegistrationSuccess(true);
      showSuccessToast("Gửi yêu cầu tham gia CLB thành công!");

      // Đóng dialog, giữ trạng thái success cho UI
      setSelectedClub(null);
    } catch (err) {
      const fallback = "Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.";
      const message =
        err instanceof Error && err.message
          ? err.message
          : fallback;
      setRegistrationError(message);
      showErrorToast(message);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <StudentLayout
      title="Khám phá CLB"
      subtitle="Tìm kiếm, so sánh và đăng ký CLB phù hợp với mục tiêu phát triển của bạn."
    >
      <div className="space-y-8">
        {/* Search Bar */}
        {searchQuery && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-sm text-blue-700">
                  Đang tìm kiếm:{" "}
                  <span className="font-semibold">"{searchQuery}"</span>
                </span>
              </div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchParams({});
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}

        {/* Layout 2 cột: Bộ lọc + Kết quả */}
        <div className="grid gap-6">
          {/* Cột phải: Kết quả & chế độ xem */}
          <section className="space-y-4">
            {/* Header kết quả + chế độ xem */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Kết quả phù hợp
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Tìm thấy{" "}
                  <span className="font-semibold text-slate-900">
                    {filteredClubs.length}
                  </span>{" "}
                  CLB {searchQuery ? `cho "${searchQuery}"` : "có sẵn"}.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Sắp xếp:</span>
                  <select className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none">
                    <option>Phổ biến nhất</option>
                    <option>Đánh giá cao</option>
                    <option>Mới nhất</option>
                    <option>Thành viên nhiều nhất</option>
                  </select>
                </div>
                <div className="inline-flex rounded-full border border-slate-300 bg-white p-1 text-xs text-slate-700">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`rounded-full px-3 py-1.5 transition ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    Lưới
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`rounded-full px-3 py-1.5 transition ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    Danh sách
                  </button>
                </div>
              </div>
            </div>

            {/* Loading state */}
            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto max-w-md space-y-3">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                  <p className="text-sm text-slate-600">
                    Đang tải danh sách CLB...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-300 bg-red-50 p-10 text-center shadow-sm">
                <div className="mx-auto max-w-md space-y-3">
                  <h4 className="text-lg font-semibold text-red-700">
                    Lỗi tải dữ liệu
                  </h4>
                  <p className="text-sm text-slate-600">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            ) : filteredClubs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto max-w-md space-y-3">
                  <h4 className="text-lg font-semibold text-slate-900">
                    Không tìm thấy CLB phù hợp
                  </h4>
                  <p className="text-sm text-slate-600">
                    Hãy thử xóa bớt từ khóa, chuyển sang chủ đề khác hoặc xem
                    toàn bộ danh sách bằng cách chọn{" "}
                    <span className="font-medium text-slate-700">"Tất cả"</span>
                    .
                  </p>
                </div>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredClubs.map((club) => (
                  <div
                    key={club.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col gap-3 hover:border-blue-200 transition h-full"
                  >
                    {/* Hình ảnh CLB ở đầu card */}
                    {club.imageUrl ? (
                      <div className="w-full h-40 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                        <img
                          src={club.imageUrl}
                          alt={club.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-40 rounded-lg bg-slate-200 flex-shrink-0"></div>
                    )}

                    {/* Thông tin CLB */}
                    <div className="flex items-start justify-between gap-3 flex-shrink-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900">
                          {club.name}
                        </p>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {club.description || "Chưa có mô tả"}
                        </p>
                      </div>
                      {club.recruiting && (
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ring-1 bg-emerald-50 text-emerald-700 ring-emerald-200 flex-shrink-0">
                          Đang tuyển
                        </span>
                      )}
                    </div>

                    {/* Thông tin chi tiết */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600 flex-shrink-0">
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <p className="text-[10px] uppercase text-slate-500">
                          Ngày thành lập
                        </p>
                        <p className="mt-1 text-sm text-slate-900">
                          {club.establishedDate
                            ? new Date(club.establishedDate).toLocaleDateString(
                                "vi-VN"
                              )
                            : "--"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <p className="text-[10px] uppercase text-slate-500">
                          Phí thành viên
                        </p>
                        <p className="mt-1 text-sm text-slate-900">
                          {club.fee === undefined || club.fee === null
                            ? "Chưa có thông tin"
                            : club.fee === 0
                            ? "Miễn phí"
                            : club.fee.toLocaleString("vi-VN") + " đ"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                        <p className="text-[10px] uppercase text-slate-500">
                          Số thành viên
                        </p>
                        <p className="mt-1 text-sm text-slate-900">
                          {club.members ?? "--"}
                        </p>
                      </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="pt-2 flex gap-2 mt-auto">
                      <button
                        onClick={async () => {
                          setViewDetailsClub(club);
                          // Fetch detailed information
                          setLoadingDetails(true);
                          try {
                            const detailedClub = await clubService.getClubDetailsById(club.id) as DetailedClubResponse;
                            setViewDetailsClub({
                              id: detailedClub.id.toString(),
                              name: detailedClub.name,
                              description: detailedClub.description,
                              members: detailedClub.memberCount ?? club.members,
                              fee: detailedClub.membershipFee ?? club.fee ?? 0,
                              recruiting: detailedClub.status?.toLowerCase() === "active",
                              imageUrl: detailedClub.imageClubsUrl ?? club.imageUrl,
                              establishedDate: detailedClub.establishedDate ?? club.establishedDate,
                              location: detailedClub.location ?? club.location,
                              contactEmail: detailedClub.contactEmail ?? club.contactEmail,
                              contactPhone: detailedClub.contactPhone ?? club.contactPhone,
                              activityFrequency: detailedClub.activityFrequency ?? club.activityFrequency,
                              totalRevenue: detailedClub.totalRevenue ?? club.totalRevenue,
                            });
                          } catch (error) {
                            console.error("Failed to fetch club details:", error);
                            // Keep the basic info if fetch fails
                          } finally {
                            setLoadingDetails(false);
                          }
                        }}
                        className="flex-1 rounded-xl border border-blue-600 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                      >
                        Xem chi tiết
                      </button>
                      {club.recruiting && (
                        <button
                          onClick={() => handleRegister(club)}
                          className="flex-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                        >
                          Đăng ký ngay
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
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row">
                      {/* Hình ảnh CLB */}
                      {club.imageUrl && (
                        <div className="flex-shrink-0 sm:w-48">
                          <div className="w-full h-40 sm:h-full sm:min-h-[120px] rounded-lg overflow-hidden bg-slate-200">
                            <img
                              src={club.imageUrl}
                              alt={club.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Nội dung */}
                      <div className="flex-1 flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {club.name}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                              {club.description || "Chưa có mô tả"}
                            </p>
                          </div>
                          {club.recruiting && (
                            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 bg-emerald-50 text-emerald-700 ring-emerald-200">
                              Đang tuyển
                            </span>
                          )}
                        </div>

                        {/* Thông tin chi tiết */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <p className="text-[10px] uppercase text-slate-500">
                              Ngày thành lập
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">
                              {club.establishedDate
                                ? new Date(
                                    club.establishedDate
                                  ).toLocaleDateString("vi-VN")
                                : "--"}
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <p className="text-[10px] uppercase text-slate-500">
                              Phí thành viên
                            </p>
                            <p className="mt-1 text-sm font-semibold text-emerald-700">
                              {club.fee === undefined || club.fee === null
                                ? "Chưa có thông tin"
                                : club.fee === 0
                                ? "Miễn phí"
                                : club.fee.toLocaleString("vi-VN") + " đ"}
                            </p>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <p className="text-[10px] uppercase text-slate-500">
                              Số thành viên
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">
                              {club.members ?? "--"}
                            </p>
                          </div>
                        </div>

                        {/* Nút hành động */}
                        <div className="pt-2 flex gap-3">
                          <button
                            onClick={async () => {
                              setViewDetailsClub(club);
                              // Fetch detailed information
                              setLoadingDetails(true);
                              try {
                                const detailedClub = await clubService.getClubDetailsById(club.id) as DetailedClubResponse;
                                setViewDetailsClub({
                                  id: detailedClub.id.toString(),
                                  name: detailedClub.name,
                                  description: detailedClub.description,
                                  members: detailedClub.memberCount ?? club.members,
                                  fee: detailedClub.membershipFee ?? club.fee ?? 0,
                                  recruiting: detailedClub.status?.toLowerCase() === "active",
                                  imageUrl: detailedClub.imageClubsUrl ?? club.imageUrl,
                                  establishedDate: detailedClub.establishedDate ?? club.establishedDate,
                                  location: detailedClub.location ?? club.location,
                                  contactEmail: detailedClub.contactEmail ?? club.contactEmail,
                                  contactPhone: detailedClub.contactPhone ?? club.contactPhone,
                                  activityFrequency: detailedClub.activityFrequency ?? club.activityFrequency,
                                  totalRevenue: detailedClub.totalRevenue ?? club.totalRevenue,
                                });
                              } catch (error) {
                                console.error("Failed to fetch club details:", error);
                                // Keep the basic info if fetch fails
                              } finally {
                                setLoadingDetails(false);
                              }
                            }}
                            className="rounded-xl border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                          >
                            Xem chi tiết
                          </button>
                          {club.recruiting && (
                            <button
                              onClick={() => handleRegister(club)}
                              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                            >
                              Đăng ký ngay
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Registration Dialog */}
      <Dialog
        open={selectedClub !== null}
        onOpenChange={(open) => !open && setSelectedClub(null)}
      >
        {selectedClub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedClub(null)}
            />
            <div className="relative z-10 w-full max-w-5xl">
              <div className="relative max-h-[90vh] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                <button
                  onClick={() => setSelectedClub(null)}
                  className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Đóng"
                >
                  ×
                </button>

                {!registrationSuccess ? (
                  <div className="grid h-full max-h-[90vh] grid-cols-1 overflow-hidden lg:grid-cols-[1.1fr_1.9fr]">
                    <aside className="flex flex-col gap-6 overflow-y-auto border-b border-slate-200 bg-slate-50 px-6 py-8 lg:border-b-0 lg:border-r">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                          CLB bạn chọn
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-slate-900">
                          {selectedClub.name}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600">
                          {selectedClub.description}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        {(selectedClub.members ?? 0) > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-slate-600">
                              Độ phủ cộng đồng
                            </p>
                            <p className="text-lg font-semibold text-slate-900">
                              {selectedClub.members}+ thành viên
                            </p>
                          </div>
                        )}
                        {/* Hình ảnh và phí/tháng */}
                        <div className="mb-3 flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                          {selectedClub.imageUrl && (
                            <div className="flex-shrink-0">
                              <img
                                src={selectedClub.imageUrl}
                                alt={selectedClub.name}
                                className="h-20 w-20 rounded-lg object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-xs text-slate-500">Phí/tháng</p>
                            <p className="text-lg font-semibold text-emerald-700">
                              {selectedClub.fee === undefined || selectedClub.fee === null
                                ? "Chưa có thông tin"
                                : selectedClub.fee === 0
                                ? "Miễn phí"
                                : `${selectedClub.fee.toLocaleString("vi-VN")}đ/tháng`}
                            </p>
                          </div>
                        </div>
                        {/* Ngày thành lập */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">
                            Ngày thành lập
                          </p>
                          {selectedClub.establishedDate ? (
                            <p className="text-lg font-semibold text-slate-900">
                              {new Date(
                                selectedClub.establishedDate
                              ).toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          ) : (
                            <p className="text-sm text-slate-400 italic">
                              Chưa có thông tin
                            </p>
                          )}
                        </div>
                      </div>
                    </aside>

                    <section className="flex h-full max-h-[90vh] flex-col overflow-hidden px-6 py-6">
                      <header className="flex-shrink-0 pb-5">
                        <span className="text-xs uppercase tracking-[0.4em] text-slate-500">
                          Đơn đăng ký
                        </span>
                        <h3 className="mt-2 text-3xl font-semibold text-slate-900">
                          Tạo hồ sơ tham gia
                        </h3>
                        <p className="mt-2 text-sm text-slate-600">
                          Thông tin càng chi tiết, Ban Quản Lý càng dễ kết nối
                          bạn với nhóm phù hợp.
                        </p>
                      </header>

                      <div className="min-h-0 flex-1 overflow-y-auto space-y-6 pr-2">
                        {registrationError && (
                          <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {registrationError}
                          </div>
                        )}

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                          <h5 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-700">
                              1
                            </span>
                            Thông tin cá nhân
                          </h5>
                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-600">
                                Họ và tên *
                              </label>
                              <input
                                type="text"
                                value={formData.fullName}
                                disabled
                                placeholder="Nguyễn Văn A"
                                className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-700 placeholder-slate-400 cursor-not-allowed"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-600">
                                Email *
                              </label>
                              <input
                                type="email"
                                value={formData.email}
                                disabled
                                placeholder="nguyenvana@fpt.edu.vn"
                                className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-700 placeholder-slate-400 cursor-not-allowed"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-600">
                                Số điện thoại *
                              </label>
                              <input
                                type="tel"
                                value={formData.phone}
                                disabled
                                placeholder="0912345678"
                                className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-700 placeholder-slate-400 cursor-not-allowed"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-600">
                                Ngành học
                              </label>
                              <input
                                type="text"
                                value={formData.major}
                                onChange={(e) =>
                                  handleFormChange("major", e.target.value)
                                }
                                placeholder="Ví dụ: Kỹ thuật phần mềm"
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-600">
                                Kỹ năng
                              </label>
                              <input
                                type="text"
                                value={formData.skills}
                                onChange={(e) =>
                                  handleFormChange("skills", e.target.value)
                                }
                                placeholder="Ví dụ: Java, Python, React"
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                          <div className="mt-4 space-y-4">
                            <div>
                              <label className="mb-1.5 block text-xs uppercase tracking-wide text-slate-600">
                                Lý do tham gia *
                              </label>
                              <textarea
                                value={formData.motivation}
                                onChange={(e) =>
                                  handleFormChange("motivation", e.target.value)
                                }
                                rows={4}
                                placeholder="Chia sẻ bạn mong muốn điều gì khi tham gia CLB..."
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Nút hành động - luôn hiển thị ở cuối */}
                      <div
                        className="mt-6 flex flex-shrink-0 flex-col gap-3 border-t border-slate-200 bg-white pt-5 pb-2 sm:flex-row"
                        style={{ zIndex: 10 }}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedClub(null)}
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                        >
                          Để sau
                        </button>
                        <button
                          type="button"
                          onClick={confirmRegistration}
                          disabled={isRegistering || !isFormValid()}
                          className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isRegistering ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                              Đang gửi...
                            </span>
                          ) : (
                            "Gửi đơn ngay"
                          )}
                        </button>
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-6 px-8 py-16 text-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-700">
                      ✓
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm uppercase tracking-[0.5em] text-emerald-700">
                        Hoàn tất
                      </p>
                      <h4 className="text-3xl font-bold text-slate-900">
                        Đăng ký thành công!
                      </h4>
                      <p className="text-base text-slate-600">
                        Cảm ơn bạn đã đăng ký tham gia{" "}
                        <span className="text-blue-700">
                          {selectedClub.name}
                        </span>
                        . Chúng tôi sẽ gửi phản hồi sớm nhất qua email.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedClub(null);
                        setRegistrationSuccess(false);
                      }}
                      className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
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

      {/* View Details Dialog */}
      {viewDetailsClub && (
        <Dialog
          open={viewDetailsClub !== null}
          onOpenChange={(open) => !open && setViewDetailsClub(null)}
        >
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setViewDetailsClub(null)}
            />
            <div className="relative z-10 w-full max-w-4xl">
              <div className="relative max-h-[90vh] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                <button
                  onClick={() => setViewDetailsClub(null)}
                  className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Đóng"
                >
                  ×
                </button>

                <div className="overflow-y-auto max-h-[90vh]">
                  {loadingDetails ? (
                    <div className="flex items-center justify-center p-16">
                      <div className="text-center space-y-4">
                        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                        <p className="text-sm text-slate-600">Đang tải thông tin chi tiết...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Header với hình ảnh */}
                      <div className="relative h-64 bg-gradient-to-br from-blue-500 to-blue-700">
                        {viewDetailsClub.imageUrl && (
                          <img
                            src={viewDetailsClub.imageUrl}
                            alt={viewDetailsClub.name}
                            className="w-full h-full object-cover opacity-80"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="flex items-center gap-3 mb-2">
                            {viewDetailsClub.recruiting && (
                              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 bg-emerald-50 text-emerald-700 ring-emerald-200">
                                Đang tuyển
                              </span>
                            )}
                          </div>
                          <h2 className="text-3xl font-bold text-white mb-2">
                            {viewDetailsClub.name}
                          </h2>
                        </div>
                      </div>

                      {/* Nội dung chi tiết */}
                      <div className="p-6 space-y-6">
                    {/* Mô tả */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">
                        Giới thiệu
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {viewDetailsClub.description || "Chưa có mô tả"}
                      </p>
                    </div>

                    {/* Thông tin cơ bản */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase text-slate-500 mb-1">
                          Ngày thành lập
                        </p>
                        <p className="text-base font-semibold text-slate-900">
                          {viewDetailsClub.establishedDate
                            ? new Date(
                                viewDetailsClub.establishedDate
                              ).toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Chưa có thông tin"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase text-slate-500 mb-1">
                          Phí thành viên
                        </p>
                        <p className="text-base font-semibold text-emerald-700">
                          {viewDetailsClub.fee === undefined || viewDetailsClub.fee === null
                            ? "Chưa có thông tin"
                            : viewDetailsClub.fee === 0
                            ? "Miễn phí"
                            : `${viewDetailsClub.fee.toLocaleString("vi-VN")} đ/tháng`}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase text-slate-500 mb-1">
                          Số thành viên
                        </p>
                        <p className="text-base font-semibold text-slate-900">
                          {viewDetailsClub.members ?? 0} thành viên
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase text-slate-500 mb-1">
                          Địa điểm
                        </p>
                        <p className="text-base font-semibold text-slate-900">
                          {viewDetailsClub.location || "Chưa có thông tin"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase text-slate-500 mb-1">
                          Tần suất hoạt động
                        </p>
                        <p className="text-base font-semibold text-slate-900">
                          {viewDetailsClub.activityFrequency || "Chưa có thông tin"}
                        </p>
                      </div>
                    </div>

                    {/* Thông tin liên hệ */}
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        Thông tin liên hệ
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <svg
                            className="h-5 w-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          {viewDetailsClub.contactEmail ? (
                            <a
                              href={`mailto:${viewDetailsClub.contactEmail}`}
                              className="text-blue-700 hover:text-blue-800 font-medium"
                            >
                              {viewDetailsClub.contactEmail}
                            </a>
                          ) : (
                            <span className="text-slate-500">Chưa có thông tin</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <svg
                            className="h-5 w-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {viewDetailsClub.contactPhone ? (
                            <a
                              href={`tel:${viewDetailsClub.contactPhone}`}
                              className="text-blue-700 hover:text-blue-800 font-medium"
                            >
                              {viewDetailsClub.contactPhone}
                            </a>
                          ) : (
                            <span className="text-slate-500">Chưa có thông tin</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                      <button
                        onClick={() => setViewDetailsClub(null)}
                        className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Đóng
                      </button>
                      {viewDetailsClub.recruiting && (
                        <button
                          onClick={() => {
                            setViewDetailsClub(null);
                            handleRegister(viewDetailsClub);
                          }}
                          className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                        >
                          Đăng ký ngay
                        </button>
                      )}
                    </div>
                  </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* Already Member Alert Dialog */}
      {showMemberAlert && (
        <Dialog
          open={showMemberAlert}
          onOpenChange={(open) => !open && setShowMemberAlert(false)}
        >
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowMemberAlert(false)}
            />
            <div className="relative z-10 w-full max-w-md">
              <div className="rounded-2xl border border-amber-300 bg-white p-6 shadow-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                    <svg
                      className="h-6 w-6 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Đã là thành viên
                  </h3>
                </div>
                <p className="mb-6 text-slate-600">
                  Bạn đã là thành viên của{" "}
                  <span className="font-semibold text-blue-700">
                    {attemptedClubName}
                  </span>{" "}
                  rồi. Không thể đăng ký lại vào câu lạc bộ này.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowMemberAlert(false)}
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Đóng
                  </button>
                  <a
                    href="/student/clubs"
                    className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Xem CLB của tôi
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </StudentLayout>
  );
}

export default StudentExplorePage;

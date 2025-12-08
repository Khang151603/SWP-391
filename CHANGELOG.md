# Tóm Tắt Thay Đổi - Hệ Thống Xác Thực Đa Vai Trò

## Files Đã Tạo Mới

### 1. `src/pages/RoleSelectionPage.tsx`
- Trang cho phép người dùng chọn vai trò khi có nhiều role
- Tự động chuyển hướng nếu chỉ có 1 role
- UI đẹp với card selection và animation

### 2. `src/components/ProtectedRoute.tsx`
- Component bảo vệ routes theo authentication và role
- Tự động redirect về login nếu chưa đăng nhập
- Redirect về role selection nếu chưa chọn role
- Kiểm tra quyền truy cập theo role

### 3. `src/components/RoleSwitcher.tsx`
- Component dropdown cho phép chuyển đổi giữa các role
- Chỉ hiển thị khi user có nhiều hơn 1 role
- Có thể thêm vào header/navbar của các layout

### 4. `AUTHENTICATION.md`
- Tài liệu hướng dẫn chi tiết về hệ thống authentication
- Giải thích luồng hoạt động
- Hướng dẫn sử dụng và test cases

## Files Đã Cập Nhật

### 1. `src/api/types/auth.types.ts`
**Thay đổi:**
- Cập nhật `AuthResponse` interface để bao gồm `accountId`, `username`, `email`, `fullName`
- Thêm `UserInfo` interface mới
- Bỏ nested `user` object trong `AuthResponse`

**Lý do:** API trả về thông tin user ở root level, không nằm trong object con

### 2. `src/api/utils/tokenManager.ts`
**Thay đổi:**
- Thêm `USER_INFO_KEY` và `SELECTED_ROLE_KEY` constants
- Thêm methods: `getUserInfo()`, `setUserInfo()`, `removeUserInfo()`
- Thêm methods: `getSelectedRole()`, `setSelectedRole()`, `removeSelectedRole()`
- Thêm method: `hasMultipleRoles()`
- Cập nhật `clear()` để xóa tất cả data

**Lý do:** Cần lưu trữ và quản lý thông tin user và selected role

### 3. `src/api/services/auth.service.ts`
**Thay đổi:**
- `register()` trả về `AuthResponse` thay vì `void`
- `register()` và `login()` lưu userInfo vào localStorage
- `refreshToken()` cập nhật userInfo
- Thêm methods: `getUserInfo()`, `getSelectedRole()`, `setSelectedRole()`, `hasMultipleRoles()`

**Lý do:** Xử lý auto-login sau register và quản lý role selection

### 4. `src/pages/LoginPage.tsx`
**Thay đổi:**
- Logic trong `handleSubmit()` kiểm tra số lượng roles
- Nếu có nhiều roles → redirect `/select-role`
- Nếu có 1 role → tự động chọn và redirect đến dashboard tương ứng
- Normalize role name (lowercase) trước khi so sánh

**Lý do:** Hỗ trợ multi-role authentication flow

### 5. `src/pages/RegisterPage.tsx`
**Thay đổi:**
- Logic trong `handleSubmit()` tương tự LoginPage
- Tự động đăng nhập sau khi đăng ký thành công (API trả về token)
- Không redirect về login page nữa

**Lý do:** Cải thiện UX - không cần đăng nhập lại sau khi đăng ký

### 6. `src/routes/AppRoutes.tsx`
**Thay đổi:**
- Import `RoleSelectionPage` và `ProtectedRoute`
- Thêm route `/select-role` với ProtectedRoute wrapper
- Wrap tất cả Student routes với `<ProtectedRoute requiredRole="student">`
- Wrap tất cả Leader routes với `<ProtectedRoute requiredRole="clubleader">`

**Lý do:** Bảo vệ routes và đảm bảo user có quyền truy cập

### 7. `src/context/AppContext.tsx`
**Thay đổi:**
- Thêm auth-related state: `user`, `isAuthenticated`, `selectedRole`
- Thêm methods: `setUser()`, `setSelectedRole()`, `logout()`
- Load user info từ localStorage khi app khởi động
- Sync với authService

**Lý do:** Centralized state management cho authentication

## Luồng Hoạt Động Mới

### Flow 1: Đăng Ký
```
User điền form → Submit → API register → Nhận token + user info
→ Lưu vào localStorage → Auto login
→ Nếu 1 role: redirect /student
→ Nếu 2+ roles: redirect /select-role
```

### Flow 2: Đăng Nhập (1 role)
```
User điền form → Submit → API login → Nhận token + user info
→ Lưu vào localStorage → Auto chọn role duy nhất
→ Redirect /student hoặc /leader
```

### Flow 3: Đăng Nhập (2+ roles)
```
User điền form → Submit → API login → Nhận token + user info
→ Lưu vào localStorage → Redirect /select-role
→ User chọn role → Lưu selected role
→ Redirect /student hoặc /leader
```

### Flow 4: Chuyển Đổi Role
```
User click RoleSwitcher → Chọn role khác
→ Lưu selected role mới → Redirect dashboard tương ứng
```

### Flow 5: Truy Cập Protected Route
```
User truy cập /student/* hoặc /leader/*
→ ProtectedRoute check authentication
→ Check selected role matches required role
→ Nếu OK: render page
→ Nếu không: redirect /login hoặc /select-role
```

## Cách Sử dụng

### Thêm RoleSwitcher vào Layout

Trong `src/components/layout/StudentLayout.tsx`:
```tsx
import RoleSwitcher from '../RoleSwitcher';

// Trong header component
<header>
  <div>Logo và menu</div>
  <RoleSwitcher />
  <UserMenu />
</header>
```

### Sử dụng Auth Context

```tsx
import { useAppContext } from '../context/AppContext';

function MyComponent() {
  const { user, selectedRole, isAuthenticated, logout } = useAppContext();

  return (
    <div>
      <p>Xin chào {user?.fullName}</p>
      <p>Role: {selectedRole}</p>
      <button onClick={logout}>Đăng xuất</button>
    </div>
  );
}
```

### Kiểm Tra Role

```tsx
import { authService } from '../api';

const roles = authService.getRoles();
const hasLeaderRole = roles.some(r => r.toLowerCase() === 'clubleader');

if (hasLeaderRole) {
  // Hiển thị link đến leader dashboard
}
```

## Breaking Changes

### ⚠️ AuthResponse Structure Changed
**Trước:**
```typescript
{
  token: string;
  roles: string[];
  user?: { id, username, email, fullName }
}
```

**Sau:**
```typescript
{
  token: string;
  accountId: number;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
}
```

### ⚠️ Register API Now Returns Token
**Trước:** Register trả về `void`, user phải login sau khi register
**Sau:** Register trả về `AuthResponse`, tự động login

### ⚠️ All Student/Leader Routes Now Protected
**Trước:** Routes không có protection
**Sau:** Tất cả routes yêu cầu authentication và role tương ứng

## Testing Checklist

- [ ] Đăng ký tài khoản mới → Auto login → Vào /student
- [ ] Đăng nhập với 1 role (Student) → Vào /student
- [ ] Đăng nhập với 2 roles → Hiển thị role selection → Chọn role → Vào dashboard
- [ ] Chuyển đổi role qua RoleSwitcher → Redirect đúng dashboard
- [ ] Truy cập /leader khi chỉ có role Student → Bị block
- [ ] Truy cập route protected khi chưa login → Redirect /login
- [ ] Refresh page → Giữ nguyên selected role
- [ ] Logout → Clear tất cả data → Redirect /login

## Next Steps (Tùy chọn)

1. **Thêm RoleSwitcher vào Layouts:**
   - StudentLayout.tsx
   - LeaderLayout.tsx

2. **Cải thiện UX:**
   - Thêm loading state khi switching role
   - Thêm toast notification khi switch role thành công
   - Animation khi transition giữa dashboards

3. **Security Enhancements:**
   - Implement token refresh logic
   - Add token expiry check
   - Secure localStorage (consider using httpOnly cookies)

4. **Testing:**
   - Unit tests cho auth service
   - Integration tests cho login/register flow
   - E2E tests cho role switching

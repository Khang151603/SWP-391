# Hệ Thống Xác Thực Đa Vai Trò (Multi-Role Authentication)

## Tổng Quan

Hệ thống xác thực cho phép người dùng có nhiều vai trò (roles) và chuyển đổi giữa các vai trò một cách linh hoạt.

## Luồng Hoạt Động

### 1. Đăng Ký (Register)
- Người dùng đăng ký tài khoản mới
- API trả về token và thông tin user với role mặc định là `Student`
- Hệ thống tự động đăng nhập và chuyển hướng đến dashboard của Student

### 2. Đăng Nhập (Login)
- Người dùng nhập username và password
- API trả về token và danh sách roles

**Trường hợp 1: Chỉ có 1 role**
- Tự động chọn role và chuyển hướng đến dashboard tương ứng
- Student → `/student`
- ClubLeader → `/leader`

**Trường hợp 2: Có nhiều roles**
- Chuyển hướng đến trang chọn role (`/select-role`)
- Người dùng chọn role muốn sử dụng
- Chuyển hướng đến dashboard tương ứng

### 3. Chuyển Đổi Vai Trò
- Sử dụng component `RoleSwitcher` trong header/navbar
- Người dùng có thể chuyển đổi giữa các role bất kỳ lúc nào
- Hệ thống tự động chuyển hướng đến dashboard tương ứng

## Cấu Trúc Dữ Liệu

### AuthResponse (từ API)
```typescript
{
  token: string;          // JWT token
  accountId: number;      // ID của account
  username: string;       // Tên đăng nhập
  email: string;          // Email
  fullName: string;       // Họ và tên
  roles: string[];        // Danh sách roles ["Student"] hoặc ["Student", "ClubLeader"]
}
```

### LocalStorage
Hệ thống lưu các thông tin sau trong localStorage:
- `token`: JWT token
- `roles`: Danh sách roles (JSON array)
- `userInfo`: Thông tin user (JSON object)
- `selectedRole`: Role hiện tại đang được chọn

## Components Chính

### 1. RoleSelectionPage
- Trang cho phép người dùng chọn role
- Hiển thị danh sách roles với icon và mô tả
- Tự động redirect nếu chỉ có 1 role

### 2. ProtectedRoute
- Component bảo vệ routes
- Kiểm tra authentication
- Kiểm tra role phù hợp với route
- Redirect về `/login` nếu chưa đăng nhập
- Redirect về `/select-role` nếu chưa chọn role

### 3. RoleSwitcher
- Component cho phép chuyển đổi role
- Hiển thị trong header/navbar
- Chỉ hiển thị khi có nhiều hơn 1 role
- Dropdown menu với danh sách roles

## API Integration

### Đăng Ký
```typescript
POST /api/Auth/register
Body: {
  username: string;
  email: string;
  password: string;
  fullName: string;
}
Response: AuthResponse
```

### Đăng Nhập
```typescript
POST /api/Auth/login
Body: {
  username: string;
  password: string;
}
Response: AuthResponse
```

## Cách Sử Dụng

### Thêm RoleSwitcher vào Layout

Trong file `StudentLayout.tsx` hoặc `LeaderLayout.tsx`:

```tsx
import RoleSwitcher from '../RoleSwitcher';

function StudentLayout({ children }) {
  return (
    <div>
      <header>
        {/* Other header content */}
        <RoleSwitcher />
      </header>
      <main>{children}</main>
    </div>
  );
}
```

### Sử dụng AppContext

```tsx
import { useAppContext } from '../context/AppContext';

function MyComponent() {
  const { user, selectedRole, logout } = useAppContext();

  return (
    <div>
      <p>Xin chào, {user?.fullName}</p>
      <p>Role hiện tại: {selectedRole}</p>
      <button onClick={logout}>Đăng xuất</button>
    </div>
  );
}
```

### Kiểm tra Role trong Component

```tsx
import { authService } from '../api';

function MyComponent() {
  const roles = authService.getRoles();
  const selectedRole = authService.getSelectedRole();
  const hasMultipleRoles = authService.hasMultipleRoles();

  if (roles.includes('ClubLeader')) {
    // Hiển thị chức năng cho ClubLeader
  }
}
```

## Routes

### Public Routes
- `/` - Trang chủ
- `/login` - Đăng nhập
- `/register` - Đăng ký

### Protected Routes
- `/select-role` - Chọn vai trò (yêu cầu authentication)
- `/student/*` - Các trang của Student (yêu cầu role Student)
- `/leader/*` - Các trang của ClubLeader (yêu cầu role ClubLeader)

## Bảo Mật

1. **JWT Token**: Được lưu trong localStorage và gửi kèm mọi request
2. **Role Validation**: Mọi protected route đều được kiểm tra role
3. **Auto Logout**: Token hết hạn sẽ tự động logout
4. **Route Guards**: ProtectedRoute component ngăn chặn truy cập trái phép

## Lưu Ý

1. Role names từ API có thể là `"Student"` hoặc `"student"`, hệ thống tự động normalize (lowercase) khi so sánh
2. Khi admin update tài khoản từ Student lên ClubLeader, user cần đăng nhập lại để nhận role mới
3. Selected role được lưu trong localStorage, giữ nguyên khi refresh trang
4. Nếu user có 2 roles, họ có thể tự do chuyển đổi mà không cần đăng xuất

## Testing

### Test Case 1: User mới đăng ký
1. Đăng ký tài khoản mới
2. Tự động đăng nhập với role Student
3. Redirect đến `/student`

### Test Case 2: User có 1 role đăng nhập
1. Đăng nhập với account chỉ có role Student
2. Tự động chọn role Student
3. Redirect đến `/student`

### Test Case 3: User có 2 roles đăng nhập
1. Đăng nhập với account có roles ["Student", "ClubLeader"]
2. Redirect đến `/select-role`
3. Chọn role ClubLeader
4. Redirect đến `/leader`
5. Sử dụng RoleSwitcher để chuyển sang Student
6. Redirect đến `/student`

### Test Case 4: Truy cập route không có quyền
1. Đăng nhập với role Student
2. Thử truy cập `/leader/dashboard`
3. Bị redirect về `/select-role` hoặc `/`

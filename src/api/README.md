# API Structure Documentation

Cấu trúc API được tổ chức theo chuẩn best practices với sự tách biệt rõ ràng giữa các concerns.

## Cấu trúc thư mục

```
src/api/
├── config/           # Cấu hình API
│   ├── constants.ts  # Endpoints và base URL
│   └── client.ts     # HTTP client với interceptors
├── services/         # API services theo domain
│   ├── auth.service.ts
│   ├── club.service.ts
│   ├── activity.service.ts
│   ├── user.service.ts
│   ├── membership.service.ts
│   ├── finance.service.ts
│   └── report.service.ts
├── types/            # TypeScript types cho từng domain
│   ├── auth.types.ts
│   ├── club.types.ts
│   ├── activity.types.ts
│   ├── user.types.ts
│   ├── membership.types.ts
│   ├── finance.types.ts
│   └── report.types.ts
├── utils/            # Utilities
│   ├── errorHandler.ts  # Xử lý lỗi API
│   └── tokenManager.ts  # Quản lý token
└── index.ts         # Export tất cả API
```

## Cách sử dụng

### Import services

```typescript
import { authService, clubService, activityService } from '@/api';
```

### Ví dụ sử dụng Auth Service

```typescript
import { authService } from '@/api';

// Login
const response = await authService.login({ username, password });

// Register
await authService.register({ username, password, fullName, email });

// Logout
await authService.logout();

// Check authentication
const isAuth = authService.isAuthenticated();
```

### Ví dụ sử dụng Club Service

```typescript
import { clubService } from '@/api';

// Get all clubs
const clubs = await clubService.getAll();

// Get club by ID
const club = await clubService.getById(1);

// Create club
const newClub = await clubService.create({
  name: 'Club Name',
  description: 'Description'
});
```

### Xử lý lỗi

```typescript
import { authService, ApiError, getErrorMessage } from '@/api';

try {
  await authService.login({ username, password });
} catch (error) {
  if (error instanceof ApiError) {
    console.error('Status:', error.status);
    console.error('Message:', error.message);
  }
  
  // Hoặc sử dụng helper
  const message = getErrorMessage(error);
  console.error(message);
}
```

## HTTP Client

HTTP client tự động:
- Thêm Authorization header với Bearer token
- Xử lý JSON serialization/deserialization
- Xử lý lỗi và throw ApiError
- Hỗ trợ tất cả HTTP methods (GET, POST, PUT, PATCH, DELETE)

## Token Management

Token được quản lý tự động thông qua `tokenManager`:

```typescript
import { tokenManager } from '@/api';

// Get token
const token = tokenManager.getToken();

// Get roles
const roles = tokenManager.getRoles();

// Check authentication
const isAuth = tokenManager.isAuthenticated();

// Clear all
tokenManager.clear();
```

## Thêm Service mới

1. Tạo types trong `types/your-domain.types.ts`
2. Thêm endpoints trong `config/constants.ts`
3. Tạo service trong `services/your-domain.service.ts`
4. Export trong `index.ts`

## Best Practices

- Luôn sử dụng services thay vì gọi HTTP client trực tiếp
- Sử dụng types từ `types/` để đảm bảo type safety
- Xử lý lỗi bằng try-catch và sử dụng `getErrorMessage` helper
- Không hardcode endpoints, sử dụng constants từ `config/constants.ts`


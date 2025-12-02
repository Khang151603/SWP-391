# Student Club Management System

Hệ thống quản lý CLB sinh viên được xây dựng với React + Tailwind CSS + Radix UI.

## Tech Stack

- ⚛️ **React 19.2** - UI Framework
- 🎨 **Tailwind CSS 4** - Utility-first CSS
- 🧩 **Radix UI** - Headless UI Components
- 📦 **TypeScript** - Type Safety
- ⚡ **Vite** - Build Tool
- 🛣️ **React Router** - Routing

## Cài đặt

```bash
npm install
```

## Chạy Development Server

```bash
npm run dev
```

Truy cập: http://localhost:5173

## Build Production

```bash
npm run build
```

## Cấu trúc thư mục

```
src/
├── components/
│   ├── ui/           # Radix UI Components
│   │   ├── Button.tsx
│   │   ├── Dialog.tsx
│   │   ├── Tabs.tsx
│   │   ├── Accordion.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Avatar.tsx
│   │   └── index.ts
│   └── layout/
│       └── MainLayout.tsx
├── pages/
│   ├── HomePage.tsx
│   └── ComponentsDemo.tsx
├── routes/
│   └── AppRoutes.tsx
└── ...
```

## Radix UI Components

Dự án sử dụng các Radix UI primitives:

- **Button** - Customizable button component
- **Dialog** - Modal/Dialog component
- **Tabs** - Accessible tabs
- **Accordion** - Collapsible content
- **Tooltip** - Hover tooltips
- **Avatar** - User avatars

### Xem Demo Components

Truy cập `/demo` để xem demo tất cả các components.

## Tính năng chính

- ✅ Quản lý Thành viên
- ✅ Quản lý Hoạt động
- ✅ Thu phí & Tài chính
- ✅ Phê duyệt Đơn

## Customization

### Tailwind Config

Cấu hình Tailwind tại `tailwind.config.js`

### Theme Colors

Colors được định nghĩa trong Tailwind:
- Primary: Purple (purple-600)
- Secondary: Pink (pink-600)
- Accent: Indigo (indigo-600)

### Components Styling

Tất cả components trong `src/components/ui/` có thể customize thông qua className props.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT

# Frontend Architecture — fe-book-manager

## Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build tool | Vite 8 |
| Routing | React Router DOM |
| State management | Zustand |
| HTTP client | Axios |
| Notifications | react-hot-toast |
| Icons | react-icons (HeroIcons) |
| Styling | Tailwind CSS (dark mode via class) |

---

## Cấu trúc thư mục

```
fe-book-manager/
├── public/                  # Static assets (favicon, icons)
├── src/
│   ├── assets/              # Hình ảnh tĩnh (hero, svg)
│   ├── components/          # Shared/reusable UI components
│   ├── data/                # Mock data (dùng khi chưa có API)
│   ├── layouts/             # Layout wrappers (User / Admin)
│   ├── pages/
│   │   ├── admin/           # Trang quản trị
│   │   └── user/            # Trang người dùng
│   ├── routes/              # Cấu hình routing tập trung
│   ├── services/            # Gọi API (axios)
│   ├── store/               # Global state (Zustand)
│   ├── types/               # TypeScript interfaces & types
│   ├── App.tsx              # Root component, khởi tạo theme & Toaster
│   └── main.tsx             # Entry point
├── index.html
├── package.json
└── vite.config.ts
```

---

## Routing

File: `src/routes/AppRouter.tsx`

Toàn bộ route được khai báo tập trung, chia 3 nhóm:

```
/                   → UserLayout → HomePage
/books              → UserLayout → BookListPage
/books/:id          → UserLayout → BookDetailPage
/cart               → UserLayout → CartPage
/checkout           → UserLayout → CheckoutPage
/login              → (no layout) → LoginPage

/admin              → AdminLayout (protected) → DashboardPage
/admin/books        → AdminLayout (protected) → ManageBooksPage
/admin/authors      → AdminLayout (protected) → ManageAuthorsPage
/admin/categories   → AdminLayout (protected) → ManageCategoriesPage
```

**Route protection:** `AdminLayout` kiểm tra `isAuthenticated` từ `authStore`, nếu chưa đăng nhập sẽ redirect về `/login` bằng `<Navigate>`.

---

## Layouts

### UserLayout
- Bao gồm: `Navbar` → `<Outlet>` → `Footer`
- Dùng cho tất cả trang người dùng

### AdminLayout
- Sidebar có thể collapse (desktop) / overlay (mobile)
- Sticky top bar với toggle theme và thông tin user
- Guard: redirect `/login` nếu chưa xác thực
- Sidebar links: Dashboard, Books, Authors, Categories
- Footer sidebar: Back to Store, Logout

---

## Components dùng chung

| Component | Mô tả |
|---|---|
| `Navbar` | Thanh điều hướng user, có giỏ hàng và toggle theme |
| `Footer` | Footer chung cho user layout |
| `BookCard` | Card hiển thị thông tin sách |
| `AdminTable` | Bảng dữ liệu dùng trong các trang admin |
| `Modal` | Dialog wrapper tái sử dụng |
| `ConfirmDialog` | Dialog xác nhận hành động (xóa, v.v.) |
| `FilterSidebar` | Bộ lọc sách (category, price, v.v.) |
| `SearchBar` | Thanh tìm kiếm |
| `Pagination` | Phân trang |
| `LoadingSkeleton` | Skeleton loading placeholder |

---

## Services (API Layer)

File gốc: `src/services/api.ts`

- Base URL: `/book-store/api`
- Axios instance với interceptor:
  - **Request:** tự động đính kèm `Authorization: Bearer <access_token>` từ `localStorage`
  - **Response (401):** tự động gọi `/auth/refresh` để lấy token mới, retry request gốc; nếu thất bại thì redirect `/login`
- Helper `buildRequest<T>()`: wrap data vào chuẩn `ApiRequest<T>` (có `request_id`, `request_time`)
- Helper `isSuccess()`: kiểm tra `response_code === '00'`

| Service | Chức năng |
|---|---|
| `authService` | login, register, refresh token, logout |
| `bookService` | CRUD sách, phân trang |
| `authorService` | CRUD tác giả |
| `categoryService` | CRUD danh mục |

---

## State Management (Zustand)

### `authStore`
- State: `isAuthenticated`, `username`
- Actions: `login()`, `logout()`, `checkAuth()`
- Persist: `localStorage` (`access_token`, `refresh_token`, `username`)

### `cartStore`
- State: `items: CartItem[]`
- Actions: `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`
- Computed: `getTotalItems()`, `getTotalPrice()`
- Persist: `localStorage` (`cart`)

### `themeStore`
- State: `isDark: boolean`
- Actions: `toggle()`
- Persist: `localStorage` (`theme`)
- Side effect: thêm/xóa class `dark` trên `document.documentElement`

---

## API Contract (Types)

Tất cả type được định nghĩa tập trung tại `src/types/index.ts`.

**Request wrapper:**
```ts
interface ApiRequest<T> {
  request_id: string;   // UUID
  request_time: string; // ISO 8601
  data: T;
  paginate?: { page: number; limit: number };
}
```

**Response wrapper:**
```ts
interface ApiResponse<T> {
  response_id: string;
  response_code: string; // "00" = success
  response_msg: string;
  response_time: string;
  data: T;
}
```

---

## Data Flow

```
User Action
    │
    ▼
Component (Page / Component)
    │  gọi service function
    ▼
Service (axios + buildRequest)
    │  HTTP request
    ▼
Backend API (/book-store/api/...)
    │  HTTP response ApiResponse<T>
    ▼
Service (kiểm tra isSuccess, trả data)
    │
    ▼
Component cập nhật local state / Zustand store
    │
    ▼
Re-render UI + react-hot-toast notification
```

---

## Theme (Dark Mode)

- Tailwind CSS với `darkMode: 'class'`
- `themeStore` quản lý trạng thái, toggle thêm/xóa class `dark` trên `<html>`
- `App.tsx` đồng bộ class khi `isDark` thay đổi qua `useEffect`
- Toaster cũng thay đổi style theo theme

---

## Ghi chú

- `src/data/mockData.ts` chứa dữ liệu giả, dùng trong giai đoạn phát triển khi API chưa sẵn sàng
- Các trang admin (`ManageBooksPage`, `ManageAuthorsPage`, `ManageCategoriesPage`) dùng chung pattern: `AdminTable` + `Modal` + `ConfirmDialog`
- Chưa có unit test, chưa có code splitting / lazy loading

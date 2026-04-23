# Frontend Architecture — fe-book-manager

## Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build tool | Vite 8 |
| Routing | React Router DOM |
| State management | Zustand |
| Server state / caching | TanStack Query v5 |
| HTTP client | Axios |
| Notifications | react-hot-toast |
| Icons | react-icons (HeroIcons hi / hi2) |
| Styling | Tailwind CSS v4 (dark mode via class, `@tailwindcss/vite` plugin) |

---

## Cấu trúc thư mục

```
fe-book-manager/
├── public/                  # Static assets (favicon, icons)
├── src/
│   ├── assets/              # Hình ảnh tĩnh (hero, svg)
│   ├── components/          # Shared/reusable UI components
│   ├── data/                # Mock data (bookService tạm dùng khi BE chưa có Book API)
│   ├── hooks/               # TanStack Query hooks (useBooks, useAuthors, useCategories, useAuth, useHealth)
│   ├── layouts/             # Layout wrappers (UserLayout / AdminLayout)
│   ├── pages/
│   │   ├── admin/           # Trang quản trị (Dashboard, ManageBooks, ManageAuthors, ManageCategories)
│   │   └── user/            # Trang người dùng (Home, BookList, BookDetail, Cart, Checkout, Login)
│   ├── routes/              # Cấu hình routing tập trung (AppRouter.tsx)
│   ├── services/            # Gọi API (axios): api, authService, authorService, categoryService, bookService, healthService
│   ├── store/               # Global client state (Zustand): authStore, cartStore, themeStore
│   ├── types/               # TypeScript interfaces & types (index.ts)
│   ├── App.tsx              # Root component — khởi tạo theme & Toaster
│   └── main.tsx             # Entry point — mount QueryClientProvider + App
├── index.html
├── package.json
└── vite.config.ts           # Vite config: @tailwindcss/vite plugin + dev proxy
```

---

## Routing

File: `src/routes/AppRouter.tsx`

Toàn bộ route khai báo tập trung, chia 3 nhóm:

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

**Route protection:** `AdminLayout` kiểm tra `isAuthenticated` từ `authStore`, redirect `/login` bằng `<Navigate>` nếu chưa xác thực.

---

## Layouts

### UserLayout
- Bao gồm: `Navbar` → `<Outlet>` → `Footer`

### AdminLayout
- Sidebar collapse được (desktop) / overlay (mobile)
- Sticky top bar: toggle theme + user dropdown menu
- **User dropdown:** View Profile, Edit Profile, Change Password, Sign Out
- Click ngoài tự đóng dropdown (`useRef` + `mousedown` listener)
- Guard: redirect `/login` nếu chưa xác thực
- `handleLogout` gọi `authStore.logout()` (async — blacklist token BE trước) rồi navigate `/login`

---

## Components dùng chung

| Component | Mô tả |
|---|---|
| `Navbar` | Thanh điều hướng user, có giỏ hàng và toggle theme |
| `Footer` | Footer chung cho user layout |
| `BookCard` | Card hiển thị thông tin sách |
| `AdminTable` | Bảng dữ liệu có search + phân trang, dùng trong các trang admin |
| `Modal` | Dialog wrapper tái sử dụng |
| `ConfirmDialog` | Dialog xác nhận hành động (xóa, v.v.) |
| `FilterSidebar` | Bộ lọc sách (category, sort) |
| `SearchBar` | Thanh tìm kiếm |
| `Pagination` | Phân trang |
| `LoadingSkeleton` | Skeleton loading placeholder |

---

## Services (API Layer)

File gốc: `src/services/api.ts`

- Base URL: `/book-store/api`
- Axios instance với interceptor:
  - **Request:** tự động đính kèm `Authorization: Bearer <access_token>` từ `localStorage`
  - **Response (401):** tự động gọi `/auth/refresh` để lấy token mới, retry request gốc; nếu thất bại thì xóa token và redirect `/login`
- Helper `buildRequest<T>()`: wrap data vào chuẩn `ApiRequest<T>` (`request_id` UUID, `request_time` ISO 8601)
- Helper `isSuccess()`: kiểm tra `response_code === '00'`

| Service | Endpoints thực | Ghi chú |
|---|---|---|
| `authService` | `POST /auth/login`, `/auth/register`, `/auth/refresh`, `/auth/logout` | logout gọi BE để blacklist cả 2 token |
| `authorService` | `POST /v1/authors/get-all`, `/get-one`, `/add`, `/update`, `/delete` | protected (JWT) |
| `categoryService` | `POST /v1/categories/get-all`, `/get-one`, `/add`, `/update`, `/delete` | protected (JWT) |
| `bookService` | mock data | BE chưa có Book API |
| `healthService` | `GET /health` | kiểm tra trạng thái server + DB |

---

## TanStack Query — Hooks

Tất cả server state được quản lý qua hooks trong `src/hooks/`:

| Hook file | Hooks | Query keys |
|---|---|---|
| `useAuthors.ts` | `useAuthors`, `useAuthor(id)`, `useCreateAuthor`, `useUpdateAuthor`, `useDeleteAuthor` | `['authors']`, `['authors', id]` |
| `useCategories.ts` | `useCategories`, `useCategory(id)`, `useCreateCategory`, `useUpdateCategory`, `useDeleteCategory` | `['categories']`, `['categories', id]` |
| `useBooks.ts` | `useBooks`, `useBook(id)`, `useCreateBook`, `useUpdateBook`, `useDeleteBook` | `['books']`, `['books', id]` |
| `useAuth.ts` | `useLogin`, `useRegister`, `useLogout` | mutation only |
| `useHealth.ts` | `useHealth` | `['health']` — poll 30s |

**Pattern chung cho mutations:**
- `onSuccess`: kiểm tra `response_code`, toast success/error, `invalidateQueries` để refetch
- `onError`: toast "Something went wrong"
- Pages chỉ cần `onSettled: () => setModalOpen(false)` — không tự toast

**QueryClient config** (`main.tsx`):
```ts
defaultOptions: {
  queries: { retry: 1, staleTime: 5 phút }
}
```

---

## State Management (Zustand)

### `authStore`
- State: `isAuthenticated`, `username`
- Actions: `login()`, `logout()` (async — gọi `authService.logout()` trước), `checkAuth()`
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

Tất cả type định nghĩa tập trung tại `src/types/index.ts`.

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
Component (Page)
    │  gọi mutation / query hook
    ▼
TanStack Query Hook
    │  gọi service function
    ▼
Service (axios + buildRequest)
    │  HTTP request (proxy → localhost:8091)
    ▼
Backend API (/book-store/api/...)
    │  HTTP response ApiResponse<T>
    ▼
Hook onSuccess/onError
    │  toast notification + invalidateQueries
    ▼
TanStack Query cache update → Re-render UI
    │
    ▼
Zustand store (auth/cart/theme) — client-only state
```

---

## Vite Dev Proxy

```ts
server: {
  proxy: {
    '/book-store/api': { target: 'http://localhost:8091', changeOrigin: true },
    '/health':         { target: 'http://localhost:8091', changeOrigin: true },
  }
}
```

Giải quyết CORS khi dev: FE `localhost:5173` → proxy → BE `localhost:8091`.

---

## Theme (Dark Mode)

- Tailwind CSS v4 với `@variant dark (&:where(.dark, .dark *))` trong `index.css`
- `@tailwindcss/vite` plugin thay thế `tailwind.config.js`
- Custom colors định nghĩa trong `@theme {}` block (`--color-primary-*`, `--color-surface-*`)
- `themeStore` toggle class `dark` trên `<html>`
- `App.tsx` đồng bộ class qua `useEffect`
- Toaster style thay đổi theo `isDark`

---

## BE API Coverage

| Domain | Endpoints | FE Status |
|---|---|---|
| Auth | register, login, refresh, logout | ✅ đủ |
| Authors | add, get-one, get-all, update, delete | ✅ đủ |
| Categories | add, get-one, get-all, update, delete | ✅ đủ |
| Books | — | ⏳ BE chưa implement, FE dùng mock |
| Health | GET /health | ✅ useHealth (poll 30s) |

---

## Ghi chú

- `bookService.ts` vẫn dùng mock data — khi BE có Book API chỉ cần swap service, hooks không đổi
- `AdminTable` có built-in search + pagination, `searchField` nhận `string` key của object
- Chưa có unit test, chưa có code splitting / lazy loading
- `models/user/role.go` chưa implement trên BE

// ===================== API WRAPPER TYPES =====================
export interface ApiRequest<T> {
  request_id: string;
  request_time: string;
  data: T;
  paginate?: Paginate;
}

export interface ApiResponse<T> {
  response_id: string;
  response_code: string;
  response_msg: string;
  response_time: string;
  data: T;
}

export interface Paginate {
  page: number;
  limit: number;
}

// ===================== AUTH =====================
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

// ===================== AUTHOR =====================
export interface Author {
  id: number;
  name: string;
}

export interface AddAuthorRequest {
  name: string;
}

export interface UpdateAuthorRequest {
  id: number;
  name: string;
}

export interface DeleteAuthorRequest {
  id: number;
}

export interface GetOneAuthorRequest {
  id: number;
}

// ===================== CATEGORY =====================
export interface Category {
  id: number;
  name: string;
}

export interface AddCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  id: number;
  name: string;
}

export interface DeleteCategoryRequest {
  id: number;
}

export interface GetOneCategoryRequest {
  id: number;
}

// ===================== BOOK (Extended for e-commerce) =====================
export interface Book {
  id: number;
  title: string;
  price: number;
  author_id: number;
  author: Author;
  categories: Category[];
  year: string;
  // Extended fields for user-facing e-commerce
  description: string;
  image: string;
  rating: number;
  stock: number;
}

export interface AddBookRequest {
  title: string;
  price: number;
  author_id: number;
  category_ids: number[];
  year: string;
  description: string;
  image: string;
  stock: number;
}

export interface UpdateBookRequest extends AddBookRequest {
  id: number;
}

export interface DeleteBookRequest {
  id: number;
}

// ===================== CART =====================
export interface CartItem {
  book: Book;
  quantity: number;
}

// ===================== ORDER =====================
export interface OrderInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerInfo: OrderInfo;
  total: number;
  date: string;
}

import { mockBooks } from '../data/mockData';
import type { ApiResponse, Book, AddBookRequest, UpdateBookRequest, DeleteBookRequest } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let books = [...mockBooks];

function buildMockResponse<T>(data: T, code = '00', msg = 'Success'): ApiResponse<T> {
  return {
    response_id: crypto.randomUUID(),
    response_code: code,
    response_msg: msg,
    response_time: new Date().toISOString(),
    data,
  };
}

export const bookService = {
  async getAll(): Promise<ApiResponse<Book[]>> {
    await delay(300);
    return buildMockResponse(books.filter(b => b.stock >= 0));
  },

  async getOne(id: number): Promise<ApiResponse<Book | null>> {
    await delay(200);
    const book = books.find(b => b.id === id) ?? null;
    return buildMockResponse(book);
  },

  async create(data: AddBookRequest): Promise<ApiResponse<Book>> {
    await delay(300);
    const newBook: Book = {
      id: Math.max(...books.map(b => b.id), 0) + 1,
      title: data.title,
      price: data.price,
      author_id: data.author_id,
      author: { id: data.author_id, name: '' },
      categories: [],
      year: data.year,
      description: data.description,
      image: data.image,
      rating: 0,
      stock: data.stock,
    };
    books = [newBook, ...books];
    return buildMockResponse(newBook);
  },

  async update(data: UpdateBookRequest): Promise<ApiResponse<Book>> {
    await delay(300);
    const idx = books.findIndex(b => b.id === data.id);
    if (idx !== -1) {
      books[idx] = { ...books[idx]!, ...data, author: books[idx]!.author, categories: books[idx]!.categories };
    }
    return buildMockResponse(books[idx]!);
  },

  async delete(data: DeleteBookRequest): Promise<ApiResponse<null>> {
    await delay(200);
    books = books.filter(b => b.id !== data.id);
    return buildMockResponse(null);
  },

  async search(query: string): Promise<ApiResponse<Book[]>> {
    await delay(200);
    const q = query.toLowerCase();
    const results = books.filter(
      b => b.title.toLowerCase().includes(q) || b.author.name.toLowerCase().includes(q)
    );
    return buildMockResponse(results);
  },
};

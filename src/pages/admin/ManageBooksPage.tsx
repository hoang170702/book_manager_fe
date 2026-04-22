import { useState } from 'react';
import { HiPlus } from 'react-icons/hi';
import AdminTable from '../../components/AdminTable';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useBooks, useCreateBook, useUpdateBook, useDeleteBook } from '../../hooks/useBooks';
import { useAuthors } from '../../hooks/useAuthors';
import type { Book } from '../../types';

export default function ManageBooksPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);
  const [form, setForm] = useState({
    title: '', price: '', author_id: '', year: '', description: '', image: '', stock: '',
  });

  const { data: books = [], isLoading } = useBooks();
  const { data: authors = [] } = useAuthors();
  const createMutation = useCreateBook();
  const updateMutation = useUpdateBook();
  const deleteMutation = useDeleteBook();

  const openAdd = () => {
    setEditBook(null);
    setForm({ title: '', price: '', author_id: '', year: '', description: '', image: '', stock: '' });
    setModalOpen(true);
  };

  const openEdit = (book: Book) => {
    setEditBook(book);
    setForm({
      title: book.title,
      price: String(book.price),
      author_id: String(book.author_id),
      year: book.year,
      description: book.description,
      image: book.image,
      stock: String(book.stock),
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      price: Number(form.price),
      author_id: Number(form.author_id),
      category_ids: [],
      year: form.year,
      description: form.description,
      image: form.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
      stock: Number(form.stock),
    };

    if (editBook) {
      updateMutation.mutate(
        { ...payload, id: editBook.id },
        { onSettled: () => setModalOpen(false) }
      );
    } else {
      createMutation.mutate(payload, { onSettled: () => setModalOpen(false) });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate({ id: deleteTarget.id }, { onSettled: () => setDeleteTarget(null) });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const columns = [
    {
      key: 'title', label: 'Title',
      render: (b: Book) => (
        <div className="flex items-center gap-3">
          <img src={b.image} alt={b.title} className="w-8 h-11 object-cover rounded-lg" />
          <span className="font-medium line-clamp-1">{b.title}</span>
        </div>
      ),
    },
    { key: 'author', label: 'Author', render: (b: Book) => b.author.name },
    { key: 'price', label: 'Price', render: (b: Book) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(b.price) },
    { key: 'stock', label: 'Stock' },
    { key: 'year', label: 'Year' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Books</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{books.length} books total</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm">
          <HiPlus className="w-5 h-5 mr-1" /> Add Book
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : (
        <AdminTable
          data={books}
          columns={columns}
          onEdit={openEdit}
          onDelete={(b) => setDeleteTarget(b)}
          searchField="title"
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editBook ? 'Edit Book' : 'Add New Book'} maxWidth="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (VND)</label>
              <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
                className="input-field" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author</label>
              <select value={form.author_id} onChange={e => setForm(p => ({ ...p, author_id: e.target.value }))}
                className="input-field" required>
                <option value="">Select author</option>
                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
              <input value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))}
                className="input-field" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
            <input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
              className="input-field" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="input-field resize-none" rows={3} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary text-sm py-2">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-primary text-sm py-2">
              {isSaving ? 'Saving...' : editBook ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Book"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}

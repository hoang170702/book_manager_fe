import { useState } from 'react';
import { HiPlus } from 'react-icons/hi';
import AdminTable from '../../components/AdminTable';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useAuthors, useCreateAuthor, useUpdateAuthor, useDeleteAuthor } from '../../hooks/useAuthors';
import type { Author } from '../../types';

export default function ManageAuthorsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editAuthor, setEditAuthor] = useState<Author | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Author | null>(null);
  const [name, setName] = useState('');

  const { data: authors = [], isLoading } = useAuthors();
  const createMutation = useCreateAuthor();
  const updateMutation = useUpdateAuthor();
  const deleteMutation = useDeleteAuthor();

  const openAdd = () => {
    setEditAuthor(null);
    setName('');
    setModalOpen(true);
  };

  const openEdit = (author: Author) => {
    setEditAuthor(author);
    setName(author.name);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editAuthor) {
      updateMutation.mutate({ id: editAuthor.id, name }, { onSettled: () => setModalOpen(false) });
    } else {
      createMutation.mutate({ name }, { onSettled: () => setModalOpen(false) });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate({ id: deleteTarget.id }, { onSettled: () => setDeleteTarget(null) });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Authors</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{authors.length} authors total</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm">
          <HiPlus className="w-5 h-5 mr-1" /> Add Author
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : (
        <AdminTable
          data={authors}
          columns={columns}
          onEdit={openEdit}
          onDelete={(a) => setDeleteTarget(a)}
          searchField="name"
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editAuthor ? 'Edit Author' : 'Add New Author'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="input-field" placeholder="Author name" required />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary text-sm py-2">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-primary text-sm py-2">
              {isSaving ? 'Saving...' : editAuthor ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Author"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
      />
    </div>
  );
}

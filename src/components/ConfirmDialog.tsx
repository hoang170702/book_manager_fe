import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  loading?: boolean;
}

export default function ConfirmDialog({
  isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="btn-secondary text-sm py-2">Cancel</button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="btn-danger text-sm py-2"
        >
          {loading ? 'Deleting...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}

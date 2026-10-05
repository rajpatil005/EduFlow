import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmDialog = ({ open, title, message, onConfirm, onCancel, loading }: ConfirmDialogProps) => (
  <Modal open={open} onClose={onCancel} title={title} size="sm">
    <p className="text-sm text-gray-600 mb-5">{message}</p>
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
      <Button variant="danger" onClick={onConfirm} loading={loading}>Confirm</Button>
    </div>
  </Modal>
);
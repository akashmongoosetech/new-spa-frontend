import React, { useState } from 'react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { Modal } from './Modal';

export interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  /** Heading. Defaults to "Delete permanently?" */
  title?: string;
  /** Item display name, rendered quoted in the message. */
  itemName?: string;
  /** Full override for the body message. `{count}` is replaced when count is set. */
  message?: string;
  /** Bulk mode: message becomes count-aware. */
  count?: number;
  /** Confirm button label. Defaults to "Delete". */
  confirmLabel?: string;
  /** Extra consequence line, e.g. access-revocation warnings. */
  dangerHint?: string;
}

/**
 * Shared destructive-action confirmation for the whole admin console.
 * Safe default: focus stays on Cancel; the confirm button disables while
 * the async action is pending so double-clicks can't double-fire.
 */
export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete permanently?',
  itemName,
  message,
  count,
  confirmLabel = 'Delete',
  dangerHint,
}) => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    if (pending) return;
    setError('');
    onClose();
  };

  const handleConfirm = async () => {
    setPending(true);
    setError('');
    try {
      await onConfirm();
      setPending(false);
      onClose();
    } catch (err) {
      setPending(false);
      setError(err instanceof Error ? err.message : 'Delete failed. Please try again.');
    }
  };

  const bulk = typeof count === 'number' && count > 1;
  const body =
    message?.replace('{count}', String(count ?? 0)) ||
    (bulk
      ? `This will permanently delete ${count} selected items. This action cannot be undone.`
      : itemName
        ? `This will permanently delete “${itemName}”. This action cannot be undone.`
        : 'This will permanently delete the selected item. This action cannot be undone.');

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} maxWidth="sm">
      <div className="space-y-4 py-1">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100">
            <Trash2 className="h-5 w-5 text-rose-600" />
          </span>
          <div className="min-w-0 space-y-1.5">
            <p className="text-sm text-gray-700">{body}</p>
            {dangerHint ? (
              <p className="flex items-start gap-1.5 text-xs font-semibold text-rose-600">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{dangerHint}</span>
              </p>
            ) : null}
          </div>
        </div>

        {error ? (
          <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={pending}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-gray-100 px-5 py-2.5 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={pending}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-rose-700 disabled:opacity-50"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {pending ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;

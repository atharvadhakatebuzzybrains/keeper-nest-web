import React from 'react';
import { X, AlertTriangle, Trash2, Lock, LogOut } from 'lucide-react';

export type ConfirmModalType = 'danger' | 'warning' | 'info' | 'success';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmModalType;
  icon?: React.ReactNode;
  isLoading?: boolean;
  isDangerous?: boolean;
}

const confirmModalStyles = {
  danger: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'bg-red-100 text-red-600',
    confirmBtn: 'bg-red-600 hover:bg-red-700',
    confirmBtnHover: 'hover:bg-red-50',
    closeIcon: 'text-red-600'
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'bg-amber-100 text-amber-600',
    confirmBtn: 'bg-amber-600 hover:bg-amber-700',
    confirmBtnHover: 'hover:bg-amber-50',
    closeIcon: 'text-amber-600'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'bg-blue-100 text-blue-600',
    confirmBtn: 'bg-blue-600 hover:bg-blue-700',
    confirmBtnHover: 'hover:bg-blue-50',
    closeIcon: 'text-blue-600'
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'bg-green-100 text-green-600',
    confirmBtn: 'bg-green-600 hover:bg-green-700',
    confirmBtnHover: 'hover:bg-green-50',
    closeIcon: 'text-green-600'
  }
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  icon,
  isLoading = false,
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  const styles = confirmModalStyles[type];
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirm action failed:', error);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-lg w-full max-w-sm mx-4 overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${styles.bg} border-b ${styles.border} px-6 py-4`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              disabled={isLoading}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium text-white ${styles.confirmBtn} disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>

        {isDangerous && (
          <div className="px-6 py-3 bg-red-50 border-t border-red-100 text-xs text-red-600 font-medium flex items-start gap-2">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            <span>This action cannot be undone.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmModal;

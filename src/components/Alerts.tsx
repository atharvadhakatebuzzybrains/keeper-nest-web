import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "../components/ui/button"
import { Bell, CheckCircle2, X, Info, AlertTriangle, AlertCircle } from "lucide-react"

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export const alertStyles = {
  success: {
    icon: CheckCircle2,
    bg: 'bg-green-50',
    text: 'text-green-600',
    button: 'bg-green-600 hover:bg-green-700',
    border: 'border-green-200',
    progress: 'bg-green-600',
    snackbarBg: 'bg-white',
    snackbarIcon: 'text-green-600',
    iconBg: 'bg-green-100'
  },
  error: {
    icon: X,
    bg: 'bg-red-50',
    text: 'text-red-600',
    button: 'bg-red-600 hover:bg-red-700',
    border: 'border-red-200',
    progress: 'bg-red-600',
    snackbarBg: 'bg-white',
    snackbarIcon: 'text-red-600',
    iconBg: 'bg-red-100'
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    button: 'bg-amber-600 hover:bg-amber-700',
    border: 'border-amber-200',
    progress: 'bg-amber-600',
    snackbarBg: 'bg-white',
    snackbarIcon: 'text-amber-600',
    iconBg: 'bg-amber-100'
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    button: 'bg-blue-600 hover:bg-blue-700',
    border: 'border-blue-200',
    progress: 'bg-blue-600',
    snackbarBg: 'bg-white',
    snackbarIcon: 'text-blue-600',
    iconBg: 'bg-blue-100'
  }
};

export interface CustomNotificationProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  type?: AlertType;
}

export const CustomNotification = ({ title, description, isOpen, onClose, type = 'info' }: CustomNotificationProps) => {
  if (!isOpen) return null;

  const styles = alertStyles[type];
  const Icon = styles.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg w-full max-w-xs sm:max-w-sm mx-auto overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className={`${styles.iconBg} p-1.5 sm:p-2 rounded-full`}>
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${styles.text}`} />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X size={16} className="sm:w-5 sm:h-5 w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 sm:mt-3">
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="mt-4 sm:mt-5 flex justify-end">
            <Button
              onClick={onClose}
              className={`${styles.button} text-white px-4 py-1 sm:px-5 sm:py-1.5 rounded-lg transition-all duration-200 flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm`}
            >
              <CheckCircle2 size={14} className="sm:w-4 sm:h-4 w-3.5 h-3.5" />
              <span>OK</span>
            </Button>
          </div>
        </div>
        <div className={`h-1 w-full ${styles.bg}`}>
          <div className={`h-full ${styles.progress} w-full animate-progress-shrink origin-left`} />
        </div>
      </div>
    </div>
  )
}

export interface SnackbarProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
  type?: AlertType;
}

export const Snackbar = ({ message, isOpen, onClose, duration = 3000, type = 'info' }: SnackbarProps) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const styles = alertStyles[type];
  const Icon = styles.icon;

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:bottom-4 sm:right-4 sm:left-auto z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className={`${styles.snackbarBg} text-gray-800 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg shadow-lg flex items-center space-x-2 sm:space-x-3 min-w-0 sm:min-w-[260px] border ${styles.border}`}>
        <div className={`${styles.iconBg} p-1 sm:p-1.5 rounded-full flex-shrink-0`}>
          <Icon size={14} className={`sm:w-4 sm:h-4 w-3.5 h-3.5 ${styles.snackbarIcon}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium truncate sm:whitespace-normal">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          <X size={14} className="sm:w-4 sm:h-4 w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

// Hook for easy notification management
export const useNotification = () => {
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: '',
    type: 'info' as AlertType
  });

  const [notification, setNotification] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'info' as AlertType
  });

  const showSnackbar = useCallback((message: string, type: AlertType = 'info') => {
    setSnackbar({
      isOpen: true,
      message,
      type
    });
  }, []);

  const showNotification = useCallback((title: string, description: string, type: AlertType = 'info') => {
    setNotification({
      isOpen: true,
      title,
      description,
      type
    });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, isOpen: false }));
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    snackbar,
    notification,
    showSnackbar,
    showNotification,
    closeSnackbar,
    closeNotification
  };
};

const Alerts = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [currentType, setCurrentType] = useState<AlertType>('info');

  const triggerAlert = (type: AlertType) => {
    setCurrentType(type);
    setShowNotification(true);
  };

  const triggerSnackbar = (type: AlertType) => {
    setCurrentType(type);
    setShowSnackbar(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center space-y-6 sm:space-y-8 md:space-y-12">
      <div className="text-center space-y-2 sm:space-y-3 md:space-y-4 max-w-lg mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">System Notification System</h1>
        <p className="text-xs sm:text-sm text-gray-500 px-2">
          Demonstration of semantic notifications for different system states.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-12 w-full max-w-2xl md:max-w-4xl">

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 border-b pb-1.5 sm:pb-2">Modal Alerts</h2>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            <Button
              onClick={() => triggerAlert('success')}
              variant="outline"
              className="border-green-200 hover:bg-green-50 text-green-700 text-xs sm:text-sm h-8 sm:h-10"
            >
              Success Modal
            </Button>
            <Button
              onClick={() => triggerAlert('error')}
              variant="outline"
              className="border-red-200 hover:bg-red-50 text-red-700 text-xs sm:text-sm h-8 sm:h-10"
            >
              Error Modal
            </Button>
            <Button
              onClick={() => triggerAlert('warning')}
              variant="outline"
              className="border-amber-200 hover:bg-amber-50 text-amber-700 text-xs sm:text-sm h-8 sm:h-10"
            >
              Warning Modal
            </Button>
            <Button
              onClick={() => triggerAlert('info')}
              variant="outline"
              className="border-blue-200 hover:bg-blue-50 text-blue-700 text-xs sm:text-sm h-8 sm:h-10"
            >
              Info Modal
            </Button>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 border-b pb-1.5 sm:pb-2">Toast Snackbars</h2>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            <Button
              onClick={() => triggerSnackbar('success')}
              variant="outline"
              className="border-green-200 hover:bg-green-50 text-green-700 text-xs sm:text-sm h-8 sm:h-10"
            >
              Success Toast
            </Button>
            <Button
              onClick={() => triggerSnackbar('error')}
              variant="outline"
              className="border-red-200 hover:bg-red-50 text-red-700 text-xs sm:text-sm h-8 sm:h-10"
            >
              Error Toast
            </Button>
            <Button
              onClick={() => triggerSnackbar('warning')}
              variant="outline"
              className="border-amber-200 hover:bg-amber-50 text-amber-700 text-xs sm:text-sm h-8 sm:h-10"
            >
              Warning Toast
            </Button>
            <Button
              onClick={() => triggerSnackbar('info')}
              variant="outline"
              className="border-blue-200 hover:bg-blue-50 text-blue-700 text-xs sm:text-sm h-8 sm:h-10"
            >
              Info Toast
            </Button>
          </div>
        </div>

      </div>

      <CustomNotification
        title={currentType.charAt(0).toUpperCase() + currentType.slice(1)}
        description="This is a demonstration of the dynamic styling system for application alerts."
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        type={currentType}
      />

      <Snackbar
        message={`Operation completed with ${currentType} status.`}
        isOpen={showSnackbar}
        onClose={() => setShowSnackbar(false)}
        type={currentType}
      />
    </div>
  )
}

export default Alerts
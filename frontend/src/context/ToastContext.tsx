import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
}

interface ToastContextType {
    showToast: (title: string, message?: string, type?: ToastType) => void;
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((title: string, message?: string, type: ToastType = 'info') => {
        const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
        const newToast: Toast = { id, title, message, type };

        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, [removeToast]);

    const success = useCallback((title: string, message?: string) => showToast(title, message, 'success'), [showToast]);
    const error = useCallback((title: string, message?: string) => showToast(title, message, 'error'), [showToast]);
    const warning = useCallback((title: string, message?: string) => showToast(title, message, 'warning'), [showToast]);
    const info = useCallback((title: string, message?: string) => showToast(title, message, 'info'), [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
            {children}
            {/* Toast Render Container */}
            <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
                {toasts.map((toast) => {
                    const icons = {
                        success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
                        error: <XCircle className="w-5 h-5 text-rose-500 shrink-0" />,
                        warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
                        info: <Info className="w-5 h-5 text-brand-500 shrink-0" />
                    };

                    const borders = {
                        success: 'border-l-4 border-l-emerald-500',
                        error: 'border-l-4 border-l-rose-500',
                        warning: 'border-l-4 border-l-amber-500',
                        info: 'border-l-4 border-l-brand-500'
                    };

                    return (
                        <div
                            key={toast.id}
                            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700/80 transition-all transform translate-y-0 animate-in fade-in slide-in-from-bottom-5 ${borders[toast.type]}`}
                        >
                            {icons[toast.type]}
                            <div className="flex-1 text-sm">
                                <p className="font-semibold text-slate-900 dark:text-white leading-snug">{toast.title}</p>
                                {toast.message && <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{toast.message}</p>}
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

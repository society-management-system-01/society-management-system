import React, { useState } from 'react';
import { Upload, X, Calendar, Clock, AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    icon,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || `input_${label.toLowerCase().replace(/\s+/g, '_')}`;

    return (
        <div className="space-y-1.5 w-full">
            <label htmlFor={inputId} className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {label} {props.required && <span className="text-rose-500">*</span>}
            </label>
            <div className="relative rounded-xl">
                {icon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    id={inputId}
                    className={`w-full text-xs font-medium bg-white dark:bg-slate-900 border rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 transition-all ${icon ? 'pl-10' : ''
                        } ${error
                            ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                            : 'border-slate-200 dark:border-slate-800 focus:ring-brand-500/20 focus:border-brand-500'
                        } ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="flex items-center gap-1 text-[11px] font-medium text-rose-500">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {error}
                </p>
            )}
            {helperText && !error && <p className="text-[11px] text-slate-400">{helperText}</p>}
        </div>
    );
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { label: string; value: string }[];
    error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, className = '', id, ...props }) => {
    const selectId = id || `select_${label.toLowerCase().replace(/\s+/g, '_')}`;

    return (
        <div className="space-y-1.5 w-full">
            <label htmlFor={selectId} className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {label} {props.required && <span className="text-rose-500">*</span>}
            </label>
            <select
                id={selectId}
                className={`w-full text-xs font-medium bg-white dark:bg-slate-900 border rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 transition-all ${error
                        ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                        : 'border-slate-200 dark:border-slate-800 focus:ring-brand-500/20 focus:border-brand-500'
                    } ${className}`}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="flex items-center gap-1 text-[11px] font-medium text-rose-500">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, helperText, className = '', id, ...props }) => {
    const areaId = id || `textarea_${label.toLowerCase().replace(/\s+/g, '_')}`;

    return (
        <div className="space-y-1.5 w-full">
            <label htmlFor={areaId} className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {label} {props.required && <span className="text-rose-500">*</span>}
            </label>
            <textarea
                id={areaId}
                rows={3}
                className={`w-full text-xs font-medium bg-white dark:bg-slate-900 border rounded-xl p-3.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 transition-all ${error
                        ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                        : 'border-slate-200 dark:border-slate-800 focus:ring-brand-500/20 focus:border-brand-500'
                    } ${className}`}
                {...props}
            />
            {error && <p className="text-[11px] font-medium text-rose-500">{error}</p>}
            {helperText && !error && <p className="text-[11px] text-slate-400">{helperText}</p>}
        </div>
    );
};

export const PhotoUploadUI: React.FC<{
    label?: string;
    onImageChange?: (url: string) => void;
}> = ({ label = 'Upload Photo Attachment', onImageChange }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fakeUrl = URL.createObjectURL(file);
            setPreview(fakeUrl);
            if (onImageChange) onImageChange(fakeUrl);
        }
    };

    const removePhoto = () => {
        setPreview(null);
        if (onImageChange) onImageChange('');
    };

    return (
        <div className="space-y-1.5 w-full">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">{label}</label>
            {preview ? (
                <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group">
                    <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl hover:border-brand-500/50 hover:bg-brand-50/30 dark:hover:bg-slate-800/40 cursor-pointer transition-all">
                    <Upload className="w-6 h-6 text-slate-400 mb-2" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Click to upload photo</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG up to 5MB</span>
                    <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </label>
            )}
        </div>
    );
};

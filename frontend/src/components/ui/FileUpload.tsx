import React, { useRef } from 'react';
import { Upload, File } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept?: string;
  onChange: (file: File | null) => void;
  value?: File | null;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  accept = '*', 
  onChange, 
  value, 
  error 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <div
        onClick={handleClick}
        className={`
          w-full p-6 border-2 border-dashed rounded-lg cursor-pointer
          transition-colors duration-200 hover:bg-gray-50
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
          ${value ? 'bg-blue-50 border-blue-300' : ''}
        `}
      >
        <div className="flex flex-col items-center">
          {value ? (
            <>
              <File className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-sm text-blue-600 font-medium">{value.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Click to replace</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">Click to upload file</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">or drag and drop</p>
            </>
          )}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
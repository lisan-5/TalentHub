import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id?: string;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}: FormInputProps) => {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <div className={`w-full ${className}`}>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${error ? 'border-red-300' : 'border-gray-300'}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
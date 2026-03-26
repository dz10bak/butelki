"use client";

interface FormInputProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  error?: string;
}

export default function FormInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  min,
  error,
}: FormInputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        className={`w-full px-4 py-3 rounded-xl border ${
          error ? "border-red-400" : "border-gray-200 dark:border-gray-700"
        } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

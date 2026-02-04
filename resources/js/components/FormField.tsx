import React from "react";

export const inputClass =
  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FABF24] focus:border-transparent";

export const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required = false,
  pattern,
  maxLength,
  options,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  maxLength?: number;
  options?: { value: string; label: string }[];
  disabled?: boolean;  // <-- Add this property
}) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    {type === "select" ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        required={required}
      >
        <option value="">Select {label}</option>
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
        required={required}
        pattern={pattern}
        maxLength={maxLength}
      />
    )}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export const SectionHeader = ({ title }: { title: string }) => (
  <div className="border-b-4 border-[#FABF24] pb-4 mb-6">
    <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
  </div>
);

export default FormField;

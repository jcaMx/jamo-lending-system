import React from 'react';

interface LabelProps {
  children: React.ReactNode;
  required?: boolean;
}

export const Label = ({ children, required }: LabelProps) => (
  <label className="block text-sm font-medium mb-1">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

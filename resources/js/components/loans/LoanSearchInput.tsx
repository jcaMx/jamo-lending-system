import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface LoanSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function LoanSearchInput({ value, onChange, placeholder = 'Search borrower...' }: LoanSearchInputProps) {
  return (
    <div className="relative w-64">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}


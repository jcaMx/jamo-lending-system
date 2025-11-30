import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LoanStatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
  Pending: { variant: 'secondary', label: 'Pending' },
  Active: { variant: 'default', label: 'Active' },
  Rejected: { variant: 'destructive', label: 'Rejected' },
  Bad_Debt: { variant: 'destructive', label: 'Bad Debt' },
  Fully_Paid: { variant: 'default', label: 'Fully Paid' },
  Overdue: { variant: 'destructive', label: 'Overdue' },
};

export function LoanStatusBadge({ status, className }: LoanStatusBadgeProps) {
  const config = statusConfig[status] || { variant: 'outline' as const, label: status };

  return (
    <Badge variant={config.variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
}


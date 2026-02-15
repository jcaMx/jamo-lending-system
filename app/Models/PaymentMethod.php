<?php

namespace App\Models;

enum PaymentMethod: string
{
    case Cash = 'Cash';
    case GCash = 'GCash';
    case Bank = 'Bank';
    case Cebuana = 'Cebuana';
    case CashVoucher = 'Cash Voucher';
    case ChequeVoucher = 'Cheque Voucher';

    public function label(): string
    {
        return match ($this) {
            self::Cash => 'Cash',
            self::GCash => 'GCash',
            self::Bank => 'Bank',
            self::Cebuana => 'Cebuana',
            self::CashVoucher => 'Cash Voucher',
            self::ChequeVoucher => 'Cheque Voucher',
        };
    }
}

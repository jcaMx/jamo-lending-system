<?php

namespace App\Models;

enum PaymentMethod: string
{
    case Cash = 'Cash';
    case GCash = 'GCash';
    case Bank = 'Bank';
    case Cebuana = 'Cebuana';

    public function label(): string
    {
        return match ($this) {
            self::Cash => 'Cash',
            self::GCash => 'GCash',
            self::Bank => 'Bank',
            self::Cebuana => 'Cebuana',
        };
    }
}

<?php

namespace App\Models;

enum PaymentMethod: string {
    case Cash = 'Cash';
    case GCash = 'GCash';
    case Metrobank = 'Metrobank';
    case Cebuana = 'Cebuana';

    public function label(): string
    {
        return match($this) {
            self::Cash      => 'Cash',
            self::GCash     => 'GCash',
            self::Metrobank => 'Metrobank',
            self::Cebuana   => 'Cebuana',
        };
    }
}


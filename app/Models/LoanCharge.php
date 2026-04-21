<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoanCharge extends Model
{
    protected $table = 'loan_charges';

    protected $fillable = ['name', 'description', 'rate', 'is_active'];

    protected $casts = [
        'rate' => 'decimal:4',
        'is_active' => 'boolean',
    ];

    public static function getActive()
    {
        return self::where('is_active', true)->get();
    }
}

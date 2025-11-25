<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BorrowerEmployment extends Model
{
    use HasFactory;

    protected $table = 'borrower_employments';

    protected $fillable = [
        'borrower_id',
        'employment_status',
        'income_source',
        'occupation',
        'position',
        'agency_address',
        'monthly_income',
    ];

    protected $casts = [
        'monthly_income' => 'decimal:2',
    ];

    public function borrower()
    {
        return $this->belongsTo(Borrower::class);
    }
}

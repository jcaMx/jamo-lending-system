<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [
        'borrower_id',
        'co_borrower_id',
        'collateral_id',
        'loan_id',
        'payment_method',
        'status',
        'submitted_at',
    ];

    // Relationships
    public function borrower()
    {
        return $this->belongsTo(Borrower::class);
    }

    public function coBorrower()
    {
        return $this->belongsTo(CoBorrower::class);
    }

    public function collateral()
    {
        return $this->belongsTo(Collateral::class);
    }

    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }
}



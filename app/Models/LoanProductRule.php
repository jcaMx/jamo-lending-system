<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoanProductRule extends Model
{
    protected $fillable = [
        'loan_product_id',
        'rule_type',
        'condition_key',
        'operator',
        'condition_value',
    ];

    public function product()
    {
        return $this->belongsTo(LoanProduct::class, 'loan_product_id');
    }
}

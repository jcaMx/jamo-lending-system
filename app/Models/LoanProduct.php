<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoanProduct extends Model
{
    public function rules()
    {
        return $this->hasMany(LoanProductRule::class, 'loan_product_id');
    }
}

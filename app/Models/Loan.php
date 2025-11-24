<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        'loan_amount','loan_type','interest_rate','term',
        'interest_type','repayment_frequency','start_date','end_date'
    ];

    public function application()
    {
        return $this->hasOne(Application::class);
    }
}


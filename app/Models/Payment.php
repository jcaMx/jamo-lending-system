<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\PaymentMethod;
use App\Models\User;

class Payment extends Model
{
    public $timestamps = false;

    protected $table = 'payment';
    protected $primaryKey = 'ID';

    protected $fillable = [
        'payment_date',
        'amount',
        'payment_method',
        'reference_no',
        'remarks',
        'verified_by',
        'verified_date',
        'loan_id',
        'schedule_id',
    ];

    protected $casts = [
        'payment_method' => PaymentMethod::class,
        'payment_date'   => 'datetime',
        'verified_date'  => 'datetime',
    ];

    public function jamoUser()
    {
        return $this->belongsTo(JamoUser::class, 'verified_by', 'ID');
    }

    public function loan()
    {
        return $this->belongsTo(Loan::class, 'loan_id', 'ID');
    }

    public function amortizationSchedule()
    {
        return $this->belongsTo(AmortizationSchedule::class, 'schedule_id', 'ID');
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}

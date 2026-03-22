<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    public $timestamps = false;

    protected $table = 'payment';
    protected $primaryKey = 'ID';

    protected $fillable = [
        'receipt_number',
        'payment_date',
        'amount',
        'status',
        'payment_method',
        'reference_no',
        'remarks',
        'verified_by',
        'verified_date',
        'loan_id',
        'schedule_id',
    ];

    protected $casts = [
        'status' => 'string',
        'payment_method' => 'string',
        'payment_date' => 'datetime',
        'verified_date' => 'datetime',
    ];

    public function loan()
    {
        return $this->belongsTo(Loan::class, 'loan_id', 'ID');
    }

    public function amortizationSchedule()
    {
        return $this->belongsTo(AmortizationSchedule::class, 'schedule_id', 'ID');
    }

    public function scheduleAllocations()
    {
        return $this->hasMany(PaymentScheduleAllocation::class, 'payment_id', 'ID');
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by', 'id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentScheduleAllocation extends Model
{
    protected $table = 'payment_schedule_allocations';

    protected $primaryKey = 'ID';

    protected $fillable = [
        'payment_id',
        'loan_id',
        'schedule_id',
        'applied_amount',
        'principal_applied',
        'interest_applied',
        'penalty_applied',
        'due_date',
        'payment_date',
    ];

    protected $casts = [
        'applied_amount' => 'decimal:2',
        'principal_applied' => 'decimal:2',
        'interest_applied' => 'decimal:2',
        'penalty_applied' => 'decimal:2',
        'due_date' => 'date',
        'payment_date' => 'date',
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payment_id', 'ID');
    }

    public function loan()
    {
        return $this->belongsTo(Loan::class, 'loan_id', 'ID');
    }

    public function amortizationSchedule()
    {
        return $this->belongsTo(AmortizationSchedule::class, 'schedule_id', 'ID');
    }
}

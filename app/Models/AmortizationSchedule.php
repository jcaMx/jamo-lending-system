<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

enum ScheduleStatus: string
{
    case Paid = 'Paid';
    case Unpaid = 'Unpaid';
    case Overdue = 'Overdue';
}

class AmortizationSchedule extends Model
{
    protected $table = 'amortizationschedule';

    protected $primaryKey = 'ID';

    public $timestamps = true;

    protected $fillable = [

        'installment_no',
        'installment_amount',
        'interest_amount',
        'due_date',
        'penalty_amount',
        'amount_paid',
        'status',
        'holiday_id',
        'loan_id',

    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    protected $casts = [

        'amount_paid' => 'decimal:2',
        'installment_amount' => 'decimal:2',
        'interest_amount' => 'decimal:2',
        'penalty_amount' => 'decimal:2',
        'status' => ScheduleStatus::class,
        'due_date' => 'datetime',

    ];

    public function payment()
    {
        return $this->hasMany(Payment::class, 'schedule_id', 'ID');
    }

    public function penalty()
    {
        return $this->hasMany(Penalty::class, 'schedule_id', 'ID');
    }

    public function holidays()
    {
        return $this->belongsTo(Holidays::class, 'holiday_id', 'ID');
    }

    public function loan()
    {
        return $this->belongsTo(Loan::class, 'loan_id', 'ID');
    }
    
    public function getTotalDueAttribute(): float
    {
        return max(0, (
            $this->installment_amount +
            $this->interest_amount +
            $this->penalty_amount -
            $this->amount_paid
        ));
    }

}

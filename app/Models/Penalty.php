<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

enum PenaltyType: string
{
    case LatePayment = 'Late_Payment';
    case BouncedCheque = 'Bounced_Cheque';
    case Other = 'Other';
}

enum PenaltyStatus: string
{
    case Pending = 'Pending';
    case Paid = 'Paid';
    case Waived = 'Waived';
}

class Penalty extends Model
{
    public $timestamps = false;

    protected $table = 'penalty';

    protected $primaryKey = 'ID';

    const PENALTY_RATE = 0.06;

    protected $fillable = [

        'type',
        'amount',
        'date_applied',
        'status',
        'schedule_id',

    ];

    protected $casts = [

        'type' => PenaltyType::class,
        'status' => PenaltyStatus::class,

    ];

    public function getAmount(): float
    {
        return (float) $this->amount;
    }

    public function amortizationSchedules()
    {
        return $this->belongsTo(AmortizationSchedule::class, 'schedule_id', 'ID');
    }
}

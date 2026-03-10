<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Disbursement extends Model
{
    protected $table = 'disbursement';

    protected $primaryKey = 'ID';

    public $timestamps = true;

    protected $fillable = [
        'loan_id',
        'borrower_id',
        'disbursement_no',
        'amount',
        'currency',
        'method',
        'reference_no',
        'status',
        'requested_at',
        'disbursed_at',
        'approved_by',
        'approved_at',
        'processed_by',
        'failure_code',
        'failure_reason',
        'remarks',
        'idempotency_key',
        'created_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'requested_at' => 'datetime',
        'disbursed_at' => 'datetime',
        'approved_at' => 'datetime',
    ];

    public function loan()
    {
        return $this->belongsTo(Loan::class, 'loan_id', 'ID');
    }

    public function borrower()
    {
        return $this->belongsTo(Borrower::class, 'borrower_id', 'ID');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by', 'id');
    }

    public function processor()
    {
        return $this->belongsTo(User::class, 'processed_by', 'id');
    }

    public function events()
    {
        return $this->hasMany(DisbursementEvent::class, 'disbursement_id', 'ID');
    }
}

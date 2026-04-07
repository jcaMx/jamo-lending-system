<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    protected $table = 'vouchers';

    protected $primaryKey = 'ID';

    public $timestamps = true;

    protected $fillable = [
        'disbursement_id',
        'loan_id',
        'voucher_no',
        'voucher_type',
        'voucher_date',
        'payee_name',
        'payee_address',
        'payee_tin',
        'particulars',
        'gross_amount',
        'prepared_by_user_id',
        'approved_by_user_id',
        'received_by_name',
        'received_at',
        'status',
        'void_reason',
    ];

    protected $casts = [
        'voucher_date' => 'date',
        'gross_amount' => 'decimal:2',
        'received_at' => 'datetime',
    ];

    public function disbursement()
    {
        return $this->belongsTo(Disbursement::class, 'disbursement_id', 'ID');
    }

    public function loan()
    {
        return $this->belongsTo(Loan::class, 'loan_id', 'ID');
    }

    public function preparedBy()
    {
        return $this->belongsTo(User::class, 'prepared_by_user_id', 'id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by_user_id', 'id');
    }

    public function chequeDetail()
    {
        return $this->hasOne(ChequeDetail::class, 'voucher_id', 'ID');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChequeDetail extends Model
{
    protected $table = 'cheque_details';

    protected $primaryKey = 'ID';

    public $timestamps = true;

    protected $fillable = [
        'voucher_id',
        'bank_account_id',
        'bank_name',
        'cheque_no',
        'cheque_date',
    ];

    protected $casts = [
        'cheque_date' => 'date',
    ];

    public function voucher()
    {
        return $this->belongsTo(Voucher::class, 'voucher_id', 'ID');
    }

    public function bankAccount()
    {
        return $this->belongsTo(BankAccount::class, 'bank_account_id', 'ID');
    }
}

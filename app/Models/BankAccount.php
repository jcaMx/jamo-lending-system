<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{
    protected $table = 'bank_accounts';

    protected $primaryKey = 'ID';

    public $timestamps = true;

    protected $fillable = [
        'bank_name',
        'account_name',
        'account_number',
        'branch',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function chequeDetails()
    {
        return $this->hasMany(ChequeDetail::class, 'bank_account_id', 'ID');
    }
}

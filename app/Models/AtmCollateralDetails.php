<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AtmCollateralDetails extends Model
{
    protected $table = 'atmcollateraldetails';

    public $timestamps = false;

    protected $fillable = [
        'bank_name',
        'account_no',
        'cardno_4digits',
        'collateral_id',
    ];

    public function collateral()
    {
        return $this->belongsTo(Collateral::class);
    }
}

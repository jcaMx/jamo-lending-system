<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LandCollateralDetails extends Model
{
    use HasFactory;

    protected $table = 'landcollateraldetails';

    protected $fillable = [
        'titleNo',
        'lotNo',
        'location',
        'areaSize',
        'collateral_id',
    ];

    public function collateral()
    {
        return $this->belongsTo(Collateral::class, 'collateral_id', 'id');
    }
}

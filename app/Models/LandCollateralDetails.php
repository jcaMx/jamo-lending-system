<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LandCollateralDetails extends Model
{
    use HasFactory;

    protected $table = 'landcollateraldetails';

    public $timestamps = false;

    protected $fillable = [
        'titleNo',
        'lotNo',
        'location',
        'areaSize',
        'collateralID',
    ];

    public function collateral()
    {
        return $this->belongsTo(Collateral::class, 'collateralID', 'ID');
    }
}

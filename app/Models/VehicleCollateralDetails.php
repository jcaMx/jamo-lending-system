<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleCollateralDetails extends Model
{
    protected $table = 'vehiclecollateraldetails';

    public $timestamps = false;

    protected $fillable = [
        'type',
        'brand',
        'model',
        'year_model',
        'plate_no',
        'engine_no',
        'transmission_type',
        'fuel_type',
        'collateral_id',
    ];

    public function collateral()
    {
        return $this->belongsTo(Collateral::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Collateral extends Model
{
    protected $table = 'collateral';

    protected $primaryKey = 'ID';

    public $timestamps = false;

    protected $fillable = [

        'type',
        'estimated_value',
        'appraisal_date',
        'appraised_by',
        'ownership_proof',
        'status',
        'remarks',
        'description',
        'loan_id',

    ];

    protected $casts = [

        'type' => 'string',
        'status' => 'string',

    ];

    public function landDetails()
    {
        return $this->hasOne(LandCollateralDetails::class, 'collateralID', 'ID');
    }

    public function vehicleDetails()
    {
        return $this->hasOne(VehicleCollateralDetails::class, 'collateral_id', 'ID');
    }

    public function atmDetails()
    {
        return $this->hasOne(AtmCollateralDetails::class, 'collateral_id', 'ID');
    }

    public function files()
    {
        return $this->hasOne(Files::class, 'collateral_id', 'ID');
    }

    public function loan()
    {
        return $this->belongsTo(Loan::class, 'loan_id', 'ID');
    }

    public function jamouser()
    {
        return $this->belongsTo(JamoUser::class, 'appraised_by', 'ID');
    }
}

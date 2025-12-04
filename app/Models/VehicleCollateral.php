<?php
  namespace App\Models;
  use Illuminate\Database\Eloquent\Model;
  use Illuminate\Database\Eloquent\Factories\HasFactory;

  class VehicleCollateral extends Collateral {

    use HasFactory;

    protected $table = 'vehiclecollateraldetails';
    protected $primaryKey = 'ID';

    protected $fillable = [

      'type',
      'brand',
      'model',
      'year_model',
      'plate_no',
      'engine_no',
      'transmission_type',
      'fuel_type',
      'collateral_id'

    ];

    protected $casts = [

      'type' => 'string',
      'transmissionType' => 'string'

    ];

    public $timestamps = false;

    public function Collateral() {
      return $this->belongsTo(Collateral::class, 'collateral_id', 'ID');
    }
  }
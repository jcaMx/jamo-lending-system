<?php
  namespace App\Models;
  use Illuminate\Database\Eloquent\Model;
  use Illuminate\Database\Eloquent\Factories\HasFactory;

  class LandCollateral extends Collateral {

    use HasFactory;

    protected $table = 'landcollateraldetails';
    protected $primaryKey = 'ID';

    protected $fillable = [

      'title_no',
      'lot_no',
      'location',
      'area_size',
      'collateral_id'

    ];

    public function Collateral() {
      return $this->belongsTo(Collateral::class, 'collateral_id', 'ID');
    }
  }
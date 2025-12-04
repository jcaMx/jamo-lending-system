<?php
  namespace App\Models;
  use Illuminate\Database\Eloquent\Model;
  use Illuminate\Database\Eloquent\Factories\HasFactory;

  class ATMCollateral extends Collateral {
    
    use HasFactory;

    protected $table = 'atmcollateraldetails';
    protected $primaryKey = 'ID';

    protected $fillable = [

      'bank_name',
      'account_no',
      'cardno_4digits',
      'collateral_id'

    ];

    public $timestamps = false;

    public function collateral() {
      return $this->belongsTo(Collateral::class, 'collateral_id', 'ID');
    }

  }
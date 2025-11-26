<?php
  namespace App\Models;
  use Illuminate\Database\Eloquent\Model;

  class BorrowerAddresses extends Model {

    public $timestamps = false;
    protected $table = 'borrower_addresses';
    protected $primaryKey = 'ID';

    protected $fillable = [

      'address',
      'city',
      'borrower_id'
      
    ];

    public function borrower() {
      return $this->belongsTo(Borrower::class, 'borrower_id', 'ID');
    }
  }
<?php
  namespace app\Models;
  use Illuminate\Database\Eloquent\Model;

  class BorrowerAddresses extends Model {

    protected $table = 'borrower_addresses';
    protected $primaryKey = 'ID';

    protected $fillable = [

      'address',
      'borrower_id'
      
    ];

    public function borrower() {
      return $this->belongsTo(Borrower::class, 'borrower_id', 'ID');
    }
  }
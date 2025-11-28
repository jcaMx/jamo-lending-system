<?php
  namespace App\Models;
  use Illuminate\Database\Eloquent\Model;

  class Spouse extends Model {

    protected $table = 'spouse';
    protected $primaryKey = 'ID';

    protected $fillable = [

      'first_name',
      'last_name',
      'contact_no',
      'occupation',
      'position',
      'agency_address',
      'borrower_id'

    ];

    public function borrower() {
      return $this->belongsTo(Borrower::class, 'borrower_id', 'ID');
    }
  }
<?php
  namespace App\Models;
  use Illuminate\Database\Eloquent\Model;

  class CoBorrower extends Model {

    public $timestamps = false;
    protected $table = 'co_borrower';
    protected $primaryKey = 'ID';

    protected $fillable = [

      'first_name', 
      'last_name', 
      'age',
      'birth_date',
      'address',
      'email',
      'contact_no',
      'occupation',
      'position',
      'agency_address',
      'marital_status',
      'home_ownership',
      'borrower_id'

    ];

    public function borrower() {
      return $this->belongsTo(Borrower::class, 'borrower_id', 'ID');
    }
  }

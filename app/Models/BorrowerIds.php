<?php
  namespace app\Models;
  use Illuminate\Database\Eloquent\Model;

  class BorrowerIds extends Model {

    protected $table = 'borrower_Ids';
    protected $primaryKey = 'ID';

    protected $fillable = [

      'id_type', 
      'id_number', 
      'borrower_id'

    ];

    public function borrower() {
      return $this->belongsTo(Borrower::class, 'borrower_id', 'ID');
    }

  }
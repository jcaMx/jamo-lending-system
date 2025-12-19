<?php
  namespace App\Models;
  use Illuminate\Database\Eloquent\Model;

  class Files extends Model {

    protected $table = 'files';
    protected $primaryKey = 'ID';
    public $timestamps = false;

    protected $fillable = [

      'file_type',
      'file_name',
      'file_path',
      'uploaded_at',
      'description',
      'borrower_id',
      'collateral_id'

    ];

    protected $casts = [

      'file_type' => 'string'

    ];

    public function collateral() {
      return $this->belongsTo(Collateral::class, 'collateral_id', 'ID');
    }

    public function borrower() {
      return $this->belongsTo(Borrower::class, 'borrower_id', 'ID');
    }

  }
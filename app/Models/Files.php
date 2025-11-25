<?php
  namespace App\Models;
  use Illuminate\Database\Eloquent\Model;

  class Files extends Model {

    protected $table = 'files';
    protected $primaryKey = 'ID';
    protected $timestamps = true;

    protected $fillable = [

      'fileType',
      'fileName',
      'filePath',
      'uploadedAt',
      'description',
      'borrowerID',
      'collateralID'

    ];

    protected $casts = [

      'fileTy[e' => 'string'

    ];

    const fileType_idDocuments = 'id_document';
    const fileType_Photo = 'photo';
    const fileType_Contract = 'Contract';
    const fileType_Collateral = 'Collateral';

    public function collateral() {
      return $this->belongsTo(Collateral::class, 'collateralID', 'ID');
    }

    public function borrower() {
      return $this->belongsTo(Borrower::class, 'borrowerID', 'ID');
    }

  }
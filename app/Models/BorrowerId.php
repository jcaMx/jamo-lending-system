<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BorrowerId extends Model
{
    use HasFactory;

    protected $table = 'borrower_ids';

    protected $fillable = [
        'borrower_id',
        'id_type',
        'id_number',
    ];

    public $timestamps = false;

    public function borrower()
    {
        return $this->belongsTo(Borrower::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BorrowerAddress extends Model
{
    use HasFactory;

    protected $table = 'borrower_addresses';

    protected $fillable = [
        'borrower_id',
        'address',
        'city',
    ];

    public function borrower()
    {
        return $this->belongsTo(Borrower::class);
    }
}

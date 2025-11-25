<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoBorrower extends Model
{
    use HasFactory;

    protected $table = 'co_borrower';

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
        'borrower_id',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'home_ownership' => 'string',
    ];

    public function borrower()
    {
        return $this->belongsTo(Borrower::class, 'borrower_id', 'ID');
    }
}

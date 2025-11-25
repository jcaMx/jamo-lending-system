<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Spouse extends Model
{
    use HasFactory;

    protected $table = 'spouse';

    protected $fillable = [
        'first_name',
        'last_name',
        'contact_no',
        'occupation',
        'position',
        'agency_address',
        'borrower_id',
    ];
    public $timestamps = false;


    public function borrower()
    {
        return $this->belongsTo(Borrower::class, 'borrower_id', 'ID');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;

    protected $table = 'files';

    protected $fillable = [
        'file_type',
        'file_name',
        'file_path',
        'uploaded_at',
        'description',
        'borrower_id',
        'collateral_id',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
    ];

    /**
     * Relationships
     */

    public function borrower()
    {
        return $this->belongsTo(Borrower::class, 'borrower_id');
    }

    public function collateral()
    {
        return $this->belongsTo(Collateral::class, 'collateral_id');
    }
}

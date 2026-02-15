<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class File extends Model
{
    use HasFactory;

    protected $table = 'files';

    protected $fillable = [
        // new polymorphic fields
        'documentable_id',
        'documentable_type',
        'document_type_id',
        'status',
        'verified_by',
        'verified_at',

        // file metadata
        'file_type',
        'file_name',
        'file_path',
        'uploaded_at',
        'description',

        // legacy columns (kept for compatibility)
        'borrower_id',
        'collateral_id',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
        'verified_at' => 'datetime',
    ];

    public function documentable(): MorphTo
    {
        return $this->morphTo();
    }

    public function documentType(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class, 'document_type_id');
    }

    public function borrower(): BelongsTo
    {
        return $this->belongsTo(Borrower::class, 'borrower_id', 'ID');
    }

    public function collateral(): BelongsTo
    {
        return $this->belongsTo(Collateral::class, 'collateral_id', 'ID');
    }
}

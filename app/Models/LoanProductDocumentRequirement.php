<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoanProductDocumentRequirement extends Model
{
    use HasFactory;

    protected $fillable = [
        'loan_product_id',
        'requirement_type',
        'document_type_id',
        'document_category',
        'subject_type',
        'collateral_type',
        'is_required',
        'min_count',
        'max_count',
        'sort_order',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'is_active' => 'boolean',
        'min_count' => 'integer',
        'max_count' => 'integer',
        'sort_order' => 'integer',
    ];

    public function loanProduct(): BelongsTo
    {
        return $this->belongsTo(LoanProduct::class);
    }

    public function documentType(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class);
    }
}

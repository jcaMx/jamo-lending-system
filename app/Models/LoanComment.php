<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class LoanComment extends Model
{
    use HasFactory;

    protected $table = 'loancomments';
    protected $primaryKey = 'ID';
    public $timestamps = false;

    protected $fillable = [
        'comment_text',
        'commented_by',
        'comment_date',
        'loan_id',
    ];

    protected $casts = [
        'comment_date' => 'datetime',
    ];

    public function loan(): BelongsTo
    {
        return $this->belongsTo(Loan::class, 'loan_id', 'ID');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'commented_by', 'id');
    }
}

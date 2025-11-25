<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

enum FormulaStatus: string
{
    case Active = 'Active';
    case InActive = 'InActive';
}

class Formula extends Model
{
    use HasFactory;

    protected $table = 'formula';

    protected $primaryKey = 'ID';

    public $timestamps = true;

    protected $fillable = [
        'name',
        'description',
        'expression',
        'variables',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    const CREATED_AT = 'created_at';

    public function loan()
    {
        return $this->hasMany(Loan::class, 'formula_id', ID);
    }
}

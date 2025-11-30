<?php

namespace app\Models;

use Illuminate\Database\Eloquent\Model;

enum EmploymentStatus: string
{
    case Employed = 'Employed';
    case UnEmployed = 'UnEmployed';
}

class BorrowerEmployment extends Model
{
    public $timestamps = false;

    protected $table = 'borrower_employments';

    protected $primaryKey = 'ID';

    protected $fillable = [

        'employment_status',
        'income_source',
        'occupation',
        'position',
        'agency_address',
        'monthly_income',
        'borrower_id',

    ];

    protected $casts = [

        'employmentStatus' => EmploymentStatus::class,

    ];

    public function borrower()
    {
        return $this->belongsTo(Borrower::class, 'borrowerID', 'ID');
    }
}

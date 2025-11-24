<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Collateral extends Model
{
    protected $fillable = [
        'collateral_type','description','estimated_value',
        'appraisal_date','appraised_by','ownership_proof'
    ];

    public function application()
    {
        return $this->hasOne(Application::class);
    }
}


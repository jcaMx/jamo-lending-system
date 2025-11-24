<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoBorrower extends Model
{
    protected $fillable = [
        'full_name','dob','age','marital_status','address','mobile',
        'dependents','home_ownership','occupation','position','employer_address'
    ];

    public function application()
    {
        return $this->hasOne(Application::class);
    }
}


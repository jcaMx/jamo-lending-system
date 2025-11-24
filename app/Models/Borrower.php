<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Borrower extends Model
{
    protected $fillable = [
        'first_name','middle_name','last_name','dob','age','marital_status',
        'address','mobile','dependents','home_ownership','occupation','position',
        'employer_address','photo','spouse_first_name','spouse_middle_name',
        'spouse_last_name','spouse_occupation','spouse_position',
        'spouse_employer_address','spouse_mobile'
    ];

    public function application()
    {
        return $this->hasOne(Application::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Borrower extends Model
{
    protected $table = 'borrower';

    protected $fillable = [
        'first_name',
        'last_name',
        'age',
        'gender',
        'email',
        'contact_no',
        'land_line',
        'marital_status',
        'numof_dependentchild',
        'home_ownership',
        'membership_date',
        'status',
        'birth_date',
    ];

    protected $casts = [
        'membership_date' => 'datetime',
        'birth_date' => 'date',
    ];

    // Relationships
    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class);
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(BorrowerAddress::class);
    }

    public function employments(): HasMany
    {
        return $this->hasMany(BorrowerEmployment::class);
    }

    public function ids(): HasMany
    {
        return $this->hasMany(BorrowerId::class);
    }

    public function coBorrowers(): HasMany
    {
        return $this->hasMany(CoBorrower::class);
    }

    public function spouse(): HasOne
    {
        return $this->hasOne(Spouse::class);
    }

    // Accessor for full name
    public function getNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
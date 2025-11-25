<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

// Enums
enum BorrowerStatus: string
{
    case Active = 'Active';
    case Closed = 'Closed';
    case Blacklisted = 'Blacklisted';
}

enum HomeOwnership: string
{
    case Owned = 'Owned';
    case Rented = 'Rented';
    case Mortgage = 'Mortgage';
}

class Borrower extends Model
{
    use HasFactory;

    protected $table = 'borrower';

    protected $primaryKey = 'ID';

    protected $fillable = [
        'first_name',
        'last_name',
        'age',
        'gender',
        'email',
        'contact_no',
        'city',
        'address',
        'land_line',
        'marital_status',
        'numof_dependentchild',
        'home_ownership',
        'membership_date',
        'status',
        'birth_date',
    ];

    public $timestamps= false; 

    protected $casts = [
        'home_ownership' => 'string',
        'status' => 'string',
        'birth_date' => 'date',
    ];

    protected $dates = [
        'membership_date',
        'birth_date',
    ];

    public function loan() {
      return $this->hasOne(Loan::class, 'borrower_id', 'ID')->latest('start_date');
    }

    public function borrowerEmployment(): HasOne
    {
        return $this->hasOne(BorrowerEmployment::class, 'borrower_id', 'ID');
    }

    public function borrowerAddresses(): HasOne
    {
        return $this->hasOne(BorrowerAddress::class, 'borrower_id', 'ID');
    }

    public function borrowerIds(): HasOne
    {
        return $this->hasOne(BorrowerId::class, 'borrower_id', 'ID');
    }

    public function coBorrower(): HasOne
    {
        return $this->hasOne(CoBorrower::class, 'borrower_id', 'ID');
    }

    public function files(): HasMany
    {
        return $this->hasMany(File::class, 'borrower_id', 'ID');
    }

    public function spouse(): HasOne
    {
        return $this->hasOne(Spouse::class, 'borrower_id', 'ID');
    }

    // Additional hasMany relationships if needed
    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class, 'borrower_id', 'ID');
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(BorrowerAddress::class, 'borrower_id', 'ID');
    }

    public function employments(): HasMany
    {
        return $this->hasMany(BorrowerEmployment::class, 'borrower_id', 'ID');
    }

    public function ids(): HasMany
    {
        return $this->hasMany(BorrowerId::class, 'borrower_id', 'ID');
    }

    public function coBorrowers(): HasMany
    {
        return $this->hasMany(CoBorrower::class, 'borrower_id', 'ID');
    }

    // Accessor for full name
    public function getNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}

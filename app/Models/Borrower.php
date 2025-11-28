<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\Loan;


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

    public $timestamps = false;

    protected $table = 'borrower';

    protected $primaryKey = 'ID';

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
      'birth_date'
    ];


    protected $casts = [
        'home_ownership' => 'string',
        'status' => 'string',
        'birth_date' => 'date',
    ];

    protected $dates = [
        'membership_date',
        'birth_date',
    ];
<<<<<<< HEAD

    public function loans() {
    return $this->hasMany(Loan::class, 'borrower_id', 'ID')->orderBy('start_date', 'desc');
}
    
=======
    
    public function loan()
    {
        return $this->hasOne(Loan::class, 'borrower_id', 'ID');
    }


>>>>>>> 9e5f51cbfb9db82cb80d584c494119cd4d6c9ba6
    public function borrowerEmployment(): HasOne
    {
        return $this->hasOne(BorrowerEmployment::class, 'borrower_id', 'ID');
    }

    public function borrowerAddress(): HasOne
    {
        return $this->hasOne(BorrowerAddress::class, 'borrower_id', 'ID');
    }

    public function borrowerId(): HasOne
    {
        return $this->hasOne(BorrowerId::class, 'borrower_id', 'ID');
    }

    public function coBorrowers() {
      return $this->hasMany(CoBorrower::class, 'borrower_id', 'ID');
    }
  
    public function files() {
      return $this->hasMany(Files::class, 'borrower_id', 'ID');
    }

     public function spouse(): HasOne
    {
        return $this->hasOne(Spouse::class, 'borrower_id', 'ID');
    }

  }

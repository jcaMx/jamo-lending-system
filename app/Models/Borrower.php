<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Borrower extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'borrower';
    protected $primaryKey = 'ID';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'user_id',
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
        'home_ownership' => 'string',
        'status' => 'string',
        'birth_date' => 'date',
    ];

    protected $dates = [
        'membership_date',
        'birth_date',
    ];

    public function loans()
    {
        return $this->hasMany(Loan::class, 'borrower_id', 'ID')->orderBy('start_date', 'desc');
    }

    public function loan()
    {
        return $this->hasOne(Loan::class, 'borrower_id', 'ID');
    }

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

    public function coBorrowers()
    {
        return $this->hasMany(CoBorrower::class, 'borrower_id', 'ID');
    }

    public function files()
    {
        return $this->hasMany(Files::class, 'borrower_id', 'ID');
    }

    public function spouse(): HasOne
    {
        return $this->hasOne(Spouse::class, 'borrower_id', 'ID');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function activeLoan()
    {
        return $this->hasOne(Loan::class, 'borrower_id', 'ID')
            ->whereIn('status', ['Active', 'Pending', 'Fully_Paid', 'Bad_Debt', 'Rejected'])
            ->latest('start_date');
    }
}

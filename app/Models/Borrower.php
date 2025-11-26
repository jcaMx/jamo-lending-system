<?php
  namespace App\Models;
  use Illuminate\Database\Eloquent\Model;
  use Illuminate\Database\Eloquent\Factories\HasFactory;
  use Illuminate\Database\Fascades\D;
  use App\Models\Loan;
  use Carbon\Carbon;

  enum BorrowerStatus: string {
    case Active = 'Active';
    case Closed = 'Closed';
    case Blacklisted = 'Blacklisted';
  }

  enum HomeOwnerShip: string {
    case Owned = 'Owned';
    case Rented = 'Rented';
    case Mortage = 'Mortgage';
  }

  class Borrower extends Model {

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
      'homeOwnerShip' => 'string',
      'status' => 'string'
    ];

    protected $dates = [
      'membership_date',
      'birth_date'
    ];

    public function loan() {
      return $this->hasOne(Loan::class, 'borrower_id', 'ID')->latest('start_date');
    }

    public function borrowerEmployment() {
      return $this->hasOne(BorrowerEmployment::class, 'borrower_id', 'ID');
    }

    public function borrowerAddresses() {
      return $this->hasOne(BorrowerAddresses::class, 'borrower_id', 'ID');
    }

    public function borrowerIds() {
      return $this->hasOne(BorrowerIds::class, 'borrower_id', 'ID');
    }

    public function coBorrowers() {
      return $this->hasMany(CoBorrower::class, 'borrower_id', 'ID');
    }
  
    public function files() {
      return $this->hasMany(Files::class, 'borrower_id', 'ID');
    }

    public function spouse() {
      return $this->hasOne(Spouse::class, 'borrower_id', 'ID');
    }
  }

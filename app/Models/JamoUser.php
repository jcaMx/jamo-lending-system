<?php
  namespace App\Models;
  use Illuminate\Database\Eloquent\Model;

  class JamoUser extends Model {

    protected $table = 'jamouser';
    protected $primaryKey = 'ID';

    protected $fillable = [

      'role_id',
      'first_name',
      'last_name',
      'email',
      'contact_no',
      'account_id'

    ];

    public function payment() {
      return $this->hasOne(Payment::class, 'verified_by', 'ID');
    }

    public function role() {
      return $this->belongsTo(Role::class, 'role_id', 'ID');
    }
    public function userAccount() {
      return $this->belongsTo(UserAccount::class, 'accountID', 'ID');
    }

    public function collateral() {
      return $this->hasMany(Collateral::class, 'appraised_by', 'ID');
    }
    
    public function loan() {
      return $this->hasMany(Loan::class, 'approved_by', 'ID');
    }
  }
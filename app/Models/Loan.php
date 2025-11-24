<?php
  namespace App\Models;

  use Illuminate\Database\Eloquent\Model;
  use Illuminate\Support\Facades\DB;
  use Illuminate\Database\Eloquent\Factories\HasFactory;
  use App\Models\AmortizationSchedule;
  use App\Repositories\Interfaces\IAmortizationCalculator;
  use App\Services\Amortization\CompoundAmortizationCalculator;
  use App\Services\Amortization\DiminishingAmortizationCalculator;
  use App\Repositories\Interfaces\IHolidayService;
  use Carbon\Carbon;

  enum LoanStatus: string {
    case Active = 'Active';
    case FullyPaid = 'Fully_Paid';
    case BadDebt = 'Bad_Debt';
    case Rejected = 'Rejected';
    case Pending = 'Pending';
  }

  enum InterestType: string {
    case Compound = 'Compound';
    case Diminishing = 'Diminishing';
  }

  enum RepaymentFrequency: string {
    case Weekly = 'Weekly';
    case Monthly = 'Monthly';
    case Yearly = 'Yearly';
  }
  
  class Loan extends Model
  {
    use HasFactory;

    protected $table = 'loan';
    protected $primaryKey = 'ID';
    public $timestamps = true;

    protected $fillable = 
    [
      'start_date',
      'end_date',
      'term_months',
      'repayment_frequency',
      'principal_amount',
      'interest_rate',
      'interest_type',
      'loan_type',
      'status',
      'balance_remaining',
      'approved_by',
      'created_at',
      'updated_at',
      'borrower_id',
      'formula_id'
    ];

    protected $casts = 
    [
      'balance_remaining' => 'decimal:2',
      'term_months' => 'integer',
      'interest_type' => InterestType::class,
      'status' => LoanStatus::class,
      'interest_rate' => 'float',
      'start_date' => 'datetime',
      'end_date' => 'datetime',
      'created_at' => 'datetime',
      'updated_at' => 'datetime',
      'repayment_frequency' => RepaymentFrequency::class
    ];

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    //Add new Loan
    public static function addLoan(array $data): Loan
    {
      $data['status'] = $data['status'] ?? LoanStatus::Pending->value;
      $data['interest_rate'] = $data['interest_rate'] ?? 5.0;
      $data['interest_type'] = $data['interest_type'] ?? InterestType::Compound->value;
      $data['principal_amount'] = $data['principal_amount'] ?? throw new \Exception('principal_amount required');
      $data['balance_remaining'] = $data['balance_remaining'] ?? $data['principal_amount'];

      return self::create($data);
    }

    public function editLoan(array $data): void
    {
      $this->fill($data);
      $this->save();
    }
    //Close the loan when fully paid
    public function closeLoan(): void
    {
      if ($this->balance_remaining == 0)
      {
        $this->status = LoanStatus::FullyPaid->value;
        $this->save();
      }
    }    

    public function collateral(){return $this->hasOne(Collateral::class, 'loan_id', 'ID');}

    public function amortizationSchedules(){return $this->hasMany(AmortizationSchedule::class, 'loan_id', 'ID');}

    public function loanComments(){return $this->hasMany(LoanComments::class, 'loan_id', 'ID');}

    public function borrower(){return $this->belongsTo(Borrower::class, 'borrower_id', 'ID');}

    public function approver(){return $this->belongsTo(JamoUser::class, 'approved_by', 'ID');}

    public function formula() {return $this->belongsTo(Formula::class, 'formula_id', 'ID');}

  }

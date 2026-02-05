<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
            'released_amount',
            'released_date',
            'created_at',
            'updated_at',
            'borrower_id',
            'formula_id',
        ];

    protected $casts =
        [
            'balance_remaining' => 'decimal:2',
            'released_amount' => 'decimal:2',
            'released_date' => 'date',
            'term_months' => 'integer',
            'interest_type' => 'string',
            'status' => 'string',
            'interest_rate' => 'float',
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'repayment_frequency' => 'string',
        ];

    const CREATED_AT = 'created_at';

    const UPDATED_AT = 'updated_at';

    // Add new Loan
    public static function addLoan(array $data): Loan
    {
        if (! isset($data['principal_amount'])) {
            throw new \Exception('principal_amount required');
        }

        $data['status'] = $data['status'] ?? 'Pending';
        $data['interest_rate'] = $data['interest_rate'] ?? 5.0;
        $data['interest_type'] = $data['interest_type'] ?? 'Compound';

        $data['balance_remaining'] = $data['balance_remaining'] ?? $data['principal_amount'];

        return self::create($data);
    }

    public function editLoan(array $data): void
    {
        $this->fill($data);
        $this->save();
    }

    // Close the loan when fully paid
    public function closeLoan(): void
    {
        if ($this->balance_remaining == 0) {
            $this->status = 'Fully_Paid';
            $this->save();
        }
    }

    public function collateral()
    {
        return $this->hasOne(Collateral::class, 'loan_id', 'ID');
    }

    public function amortizationSchedules()
    {
        return $this->hasMany(AmortizationSchedule::class, 'loan_id', 'ID');
    }

    public function loanComments()
    {
        return $this->hasMany(LoanComment::class, 'loan_id', 'ID');
    }

    public function borrower()
    {
        return $this->belongsTo(Borrower::class, 'borrower_id', 'ID');
    }

    public function approver()
    {
        return $this->belongsTo(JamoUser::class, 'approved_by', 'ID');
    }

    public function formula()
    {
        return $this->belongsTo(Formula::class, 'formula_id', 'ID');
    }
}

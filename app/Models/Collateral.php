<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Collateral extends Model
{
    protected $table = 'collateral';

    protected $fillable = [
        'type',
        'estimated_value',
        'appraisal_date',
        'ownership_proof',
        'status',
        'remarks',
        'description',
        'appraised_by',
        'loan_id',
    ];

    protected $casts = [
        'estimated_value' => 'decimal:2',
        'appraisal_date' => 'datetime',
    ];

    // Relationships
    public function loan(): BelongsTo
    {
        return $this->belongsTo(Loan::class);
    }

    public function appraisedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'appraised_by');
    }

    // Polymorphic relationships to detail tables
    public function landDetails(): HasOne
    {
        return $this->hasOne(LandCollateralDetails::class, 'collateral_id', 'id');
    }

    public function vehicleDetails(): HasOne
    {
        return $this->hasOne(VehicleCollateralDetails::class, 'collateral_id', 'id');
    }

    public function atmDetails(): HasOne
    {
        return $this->hasOne(AtmCollateralDetails::class, 'collateral_id', 'id');
    }

    // Get details based on type
    public function getDetailsAttribute()
    {
        return match ($this->type) {
            'Land' => $this->landDetails,
            'Vehicle' => $this->vehicleDetails,
            'ATM' => $this->atmDetails,
            default => null,
        };
    }

    // Get formatted details string
    public function getCollateralDetails(): string
    {
        return match ($this->type) {
            'Land' => $this->getLandDetailsString(),
            'Vehicle' => $this->getVehicleDetailsString(),
            'ATM' => $this->getAtmDetailsString(),
            default => 'No details available',
        };
    }

    private function getLandDetailsString(): string
    {
        $details = $this->landDetails;
        if (! $details) {
            return 'Land - No details';
        }

        return sprintf(
            'Land - Title: %s, Lot: %s, Location: %s, Area: %s',
            $details->titleNo,
            $details->lotNo,
            $details->location,
            $details->areaSize
        );
    }

    private function getVehicleDetailsString(): string
    {
        $details = $this->vehicleDetails;
        if (! $details) {
            return 'Vehicle - No details';
        }

        return sprintf(
            'Vehicle - %s %s %s (%s), Plate: %s',
            $details->brand,
            $details->model,
            $details->year_model,
            $details->type,
            $details->plate_no ?? 'N/A'
        );
    }

    private function getAtmDetailsString(): string
    {
        $details = $this->atmDetails;
        if (! $details) {
            return 'ATM - No details';
        }

        return sprintf(
            'ATM - %s, Account: %s, Card: ****%s',
            $details->bank_name,
            $details->account_no,
            $details->cardno_4digits
        );
    }
}
